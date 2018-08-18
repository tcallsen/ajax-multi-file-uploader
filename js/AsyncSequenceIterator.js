class AsyncSequenceIterator{
			
  constructor(iterationsCount, enqueuedPromise, promiseContext) {

    // track loop parameters
    this.iteration = 0
    this.iterationsCount = iterationsCount
    this.enqueuedPromise = enqueuedPromise
    this.promiseContext = promiseContext
    this.rejectHasOccured = false
    
    // create promise to be called when loop is complete
    this.whenComplete = new Promise((resolve,reject) => {
      this.resolve = resolve
      this.reject = reject
    })

    // start loop
    this.iterate()
  
  }

  iterate() {
    
    // envoke next iteration of enqueued Promis
    this.enqueuedPromise.call(this.promiseContext, this.iteration)
      // catch and record any rejections
      .catch( () => {
        this.rejectHasOccured = true
      })
      .finally( () => {
        // continue through iterations if not complete
        if (this.iteration < this.iterationsCount) {
          ++this.iteration
          this.iterate()
        // reject parent Promises if any enqueued Promises were rejected
        } else if (this.rejectHasOccured) this.reject()
        // otherwise resolve parent Promises
        else this.resolve()
      })
  }

}