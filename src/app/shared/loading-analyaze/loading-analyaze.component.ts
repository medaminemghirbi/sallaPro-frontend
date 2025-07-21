import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-analyaze',
  templateUrl: './loading-analyaze.component.html',
  styleUrls: ['./loading-analyaze.component.css']
})
export class LoadingAnalyazeComponent implements OnInit {
@Input() isLoading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
