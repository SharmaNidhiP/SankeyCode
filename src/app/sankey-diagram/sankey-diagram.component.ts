import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'; // Import the sankey function

@Component({
  selector: 'app-sankey-diagram',
  templateUrl: './sankey-diagram.component.html',
  styleUrls: ['./sankey-diagram.component.css']
})
export class SankeyDiagramComponent implements OnInit {
  @ViewChild('sankey', { static: true })
  private chartContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    const element = this.chartContainer.nativeElement;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', 800)
      .attr('height', 400);

    const data = {
      nodes: [
        { name: 'Node 1' },
        { name: 'Node 2' },
        { name: 'Node 3' },
        { name: 'Node 4' },
      ],
      links: [
        { source: 0, target: 1, value: 10 },
        { source: 1, target: 2, value: 5 },
        { source: 2, target: 3, value: 8 },
      ]
    };

    const sankeyLayout = sankey<Data, DataLink>()
      .nodeWidth(40)
      .nodePadding(10)
      .extent([[20, 20], [780, 380]]);

    const { nodes, links } = sankeyLayout(data);

    svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', 'blue')
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .style('mix-blend-mode', 'multiply');

    svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', 'black');

    svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d: any) => (d.x0 + d.x1) / 2)
      .attr('y', (d: any) => d.y0 - 5)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.name);
  }
}

interface Data {
  name: string;
}

interface DataLink {
  source: number;
  target: number;
  value: number;
}
