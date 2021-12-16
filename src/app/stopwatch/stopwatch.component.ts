import {Component, OnInit} from '@angular/core';
import {Observable, Subject, timer} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit {
  timer$: Observable<number> | undefined
  clickTimeout: number | undefined | null

  pauseClick$ = new Subject()
  stopClick$ = new Subject()
  isRunning = false
  time = 0

  ngOnInit(): void {
    this.timer$ = timer(1000, 1000)
  }

  start(): void {
    this.startAndContinue()
  }

  listenDoubleClickForWaitButton() {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
      this.clickTimeout = null
      this.wait()
    } else {
      this.clickTimeout = setTimeout(() => {
        this.clickTimeout = null
      }, 500)
    }
  }

  wait(): void {
    this.isRunning = false
    this.pauseClick$.next()
  }

  startAndContinue(): void {
    this.isRunning = true
    this.timer$?.pipe(
      takeUntil(this.pauseClick$),
      takeUntil(this.stopClick$)
    ).subscribe(() => {
      this.time += 1000
    })
  }

  reset(): void {
    this.stopClick$.next()
    this.time = 0
    this.startAndContinue()
  }

  stop(): void {
    this.isRunning = false
    this.time = 0
    this.stopClick$.next()
  }
}
