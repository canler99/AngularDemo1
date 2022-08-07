import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Friend} from '../../models/friends.types';

@Component({
  selector: 'app-d3-graphic',
  templateUrl: './d3-graphic.component.html',
  styleUrls: ['./d3-graphic.component.scss'],
  //  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class D3GraphicComponent implements OnInit {
  private _d3Data: any;

  private svg: any;
  private margin = 50;
  private width = 600 - this.margin * 2;
  private height = 200 - this.margin * 2;

  constructor() {
    console.log('Graphics component instatiated');
  }

  @Input() set friendList(value: Friend[]) {
    this._d3Data = this.convertModelDataToD3(value);

    if (this.svg) {
      this.createSvg();
      this.drawBars(this._d3Data);
    }
  }

  ngOnInit(): void {
    console.log('Graphics component initialized');

    this.createSvg();
    this.drawBars(this._d3Data);
  }

  convertModelDataToD3(children: Friend[] = []) {
    return children.map(({name, age, weight}) => ({
      name,
      age: age.toString(),
      weight: weight.toString(),
    }));
  }

  private createSvg(): void {
    d3.select('figure#bar > svg').remove();

    this.svg = d3
        .select('figure#bar')
        .append('svg')
        .attr('width', this.width + this.margin * 2)
        .attr('height', this.height + this.margin * 3)
        .append('g')
        .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3
        .scaleBand()
        .range([0, this.width])
        .domain(data.map(d => d.name))
        .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
        .append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 150]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg
        .selectAll('bars')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d: any) => {
          return x(d.name);
        })
        .attr('y', (d: any) => y(d.age))
        .attr('width', x.bandwidth())
        .attr('height', (d: any) => this.height - y(d.age))
        .attr('fill', '#d04a35');
  }
}
