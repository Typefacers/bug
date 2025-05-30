import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Bug } from '../types/bug'
import { forecastBugCounts } from '../lib/bug-forecast'
import { useElementSize } from '../hooks/use-element-size'

const BugForecast = ({ bugs }: { bugs: Bug[] }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const size = useElementSize(wrapperRef)

  const data = forecastBugCounts(bugs, 7)

  const renderChart = () => {
    if (!svgRef.current || !size.width) return

    const width = size.width
    const height = 160
    const margin = { top: 20, right: 20, bottom: 20, left: 30 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleBand()
      .domain(data.map(d => d3.timeFormat('%a')(d.date)))
      .range([0, innerWidth])
      .padding(0.2)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count)!])
      .nice()
      .range([innerHeight, 0])

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d3.timeFormat('%a')(d.date))!)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.count))
      .attr('fill', '#3b82f6')

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('font-size', 10)

    g.append('g').call(d3.axisLeft(y).ticks(3).tickFormat(d3.format('d')))
  }

  useEffect(() => {
    renderChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugs, size.width])

  return (
    <div ref={wrapperRef} className="w-full">
      <svg ref={svgRef} className="w-full h-40 select-none" />
    </div>
  )
}

export default BugForecast
