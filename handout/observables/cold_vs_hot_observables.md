# Cold vs. Hot Observables
Observables can be classified into 2 main groups, Hot and Cold Observables. Let's start with a cold Observable. 

```js
import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/publish';

@Component({
	selector: 'app-root',
	template: `
	  <b>Angular 2 Component Using Observables!</b>
	  <div>Subscription A: {{valuesA.toString()}}</div>
	  <div>Subscription B: {{valuesB.toString()}}</div>
  `
})
export class AppComponent {
  
  private data:Observable<Array<number>>;
  private valuesA:Array<number> = [];
  private valuesB:Array<number> = [];

	constructor() {

		this.data = new Observable(observer => {
		  setTimeout(() => {
		    observer.next(42);
		  }, 1000);
		  
		  setTimeout(() => {
		    observer.next(43);
		  }, 3000);

	  });
    
    setTimeout(() => {
      this.data.subscribe(value => this.valuesA.push(value));
    }, 0);
    
    setTimeout(() => {
      this.data.subscribe(value => this.valuesB.push(value));
    }, 2000)
    
    
}
```
[View Example](http://plnkr.co/edit/cKDMkYUx55nnVvVhMblz)

In the above case subscriber B subscribes 2000ms after subscriber A. Yet subscriber B is starting to get values like subscriber A only time shifted. This behaviour is referred to as a Cold Observable. A useful analogy is watching a pre-recorded video, let's say on Netflix. You press play and the movie starts playing from the beginning. Someone else, can start playing the same movie in their own home 25 minutes later.

On the other hand there is also a Hot Observable, which is more like a live performance. You attend a live band performance from the beginning, but someone else might be 25 minutes late to the show. The band will not start playing from the beginning and you have to start watching the performance from where it is.

We have already encountered both kind of observables, the example above is a cold observable, while an example that uses `valueChanges` on our text field input is a hot observable.

### Converting from Cold Observables to Hot Observables
A useful method within RxJS API, is the `publish` method. This method takes in a cold observable as it's source and returns an instance of a `ConnectableObservable`. In this case we will have to explicitly call `connect` on our hot observable to start broadcasting values to its subscribers.

```js
export class AppComponent {
  
  private data:Observable<Array<number>>;
  private valuesA:Array<number> = [];
  private valuesB:Array<number> = [];

	constructor() {

		this.data = new Observable(observer => {
		  setTimeout(() => {
		    observer.next(42);
		  }, 1000);
		  
		  setTimeout(() => {
		    observer.next(43);
		  }, 3000);

	  }).publish();
	  
	  setTimeout(() => {
	    this.data.connect()
	  }, 1500);
    
    setTimeout(() => {
      this.data.subscribe(value => this.valuesA.push(value));
    }, 0);
    
    setTimeout(() => {
      this.data.subscribe(value => this.valuesB.push(value));
    }, 2000)
}
```
[View Example](http://plnkr.co/edit/J1QPds2mHgWO17Ms06Hq)

In the case above, the live performance starts at 1500ms, subscriber A arrived to the concert hall 1500ms early to get a good seat, and our subscriber B arrived to the performance 500ms late and missed a bunch of songs.

Another useful method to work with hot observables instead of `connect` is `refCount`. This is auto connect method, that will start broadcasting as soon as there are more than one subscriber. Analogously, it will stop if the number of subscribers goes to 0, in other words no performance will happen if there is no one in the audience.

