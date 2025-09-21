import { useEffect, useRef } from 'react'
import { useElementSize } from '../hooks/use-element-size'
import * as d3 from 'd3'
import { styled } from 'styled-components'
import { Bug } from '../types/bug'
import type { DataPoint } from '../types/bug-trends-chart'

/**
 * Interactive line chart that tracks how many bugs were reported
 * and resolved on each calendar day.
 *
 * • Resizes automatically with its container (ResizeObserver).
 * • Displays a friendly "No data" placeholder if nothing to plot.
 */
const ChartWrapper = styled.div`
  width: 100%;
`

const ChartSvg = styled.svg`
  width: 100%;
  height: 320px;
  user-select: none;
`

const BugTrendsChart = ({ bugs }: { bugs: Bug[] }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const size = useElementSize(wrapperRef)

  /** Main render routine -------------------------------------------------- */
  const renderChart = () => {
    if (!svgRef.current || !size.width) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // wipe previous

    // ----- Dimensions (responsive) ---------------------------------------
    const containerWidth = size.width
    const margin = { top: 20, right: 20, bottom: 35, left: 48 }
    const innerWidth = containerWidth - margin.left - margin.right
    const innerHeight = 320 - margin.top - margin.bottom

    svg
      .attr('width', containerWidth)
      .attr('height', innerHeight + margin.top + margin.bottom)
      .attr(
        'viewBox',
        `0 0 ${containerWidth} ${innerHeight + margin.top + margin.bottom}`
      )
      .attr('preserveAspectRatio', 'xMidYMid meet')

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const defs = svg.append('defs')
    const gradientReported = defs
      .append('linearGradient')
      .attr('id', 'gradient-reported')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '1')
    gradientReported
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f97316')
      .attr('stop-opacity', 0.4)
    gradientReported
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f97316')
      .attr('stop-opacity', 0)

    const gradientResolved = defs
      .append('linearGradient')
      .attr('id', 'gradient-resolved')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '1')
    gradientResolved
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.4)
    gradientResolved
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0)

    // ----- Data wrangling -------------------------------------------------
    const floor = d3.timeDay.floor

    const created = d3.rollup(
      bugs.filter(b => b.createdAt),
      (v: Bug[]) => v.length,
      (b: Bug) => floor(new Date(b.createdAt!))
    )

    const resolved = d3.rollup(
      bugs.filter(b => b.resolvedAt),
      (v: Bug[]) => v.length,
      (b: Bug) => floor(new Date(b.resolvedAt!))
    )

    const allDays = Array.from(
      new Set([...created.keys(), ...resolved.keys()])
    ).sort((a, b) => a.getTime() - b.getTime())

    if (allDays.length === 0) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', 16)
        .attr('fill', '#6b7280') // gray-500
        .text('No data to display')
      return
    }

    const series = allDays.map(d => ({
      date: d,
      created: created.get(d) ?? 0,
      resolved: resolved.get(d) ?? 0,
    }))

    // ----- Scales ---------------------------------------------------------
    const x = d3
      .scaleTime()
      .domain(d3.extent(allDays) as [Date, Date])
      .range([0, innerWidth])

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(series, (d: DataPoint) => Math.max(d.created, d.resolved)) || 1,
      ])
      .nice()
      .range([innerHeight, 0])

    // ----- Axes & grids ---------------------------------------------------
    const xGrid = g
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickSize(-innerHeight)
          .tickFormat(() => '')
      )
    xGrid
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-dasharray', '2,2')
    xGrid.select('path').remove()

    const yGrid = g
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
    yGrid
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-dasharray', '2,2')
    yGrid.select('path').remove()

    const xAxis = g.append('g').attr('transform', `translate(0,${innerHeight})`)
    const yAxis = g.append('g')

    const drawAxes = (xScale: d3.ScaleTime<number, number>) => {
      xAxis.call(
        d3
          .axisBottom<Date>(xScale)
          .ticks(6)
          .tickSizeOuter(0)
          .tickFormat((d: Date) => d3.timeFormat('%b %d')(d))
      )
      yAxis
        .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
        .call(sel => sel.selectAll('text').attr('dx', '-0.25em'))
    }

    drawAxes(x)
    let currentX = x

    const zoomBehavior = d3
      .zoom<SVGRectElement, unknown>()
      .scaleExtent([1, 5])
      .translateExtent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .on('zoom', event => {
        currentX = event.transform.rescaleX(x)
        createdLine.attr(
          'd',
          lineCreated.x(d => currentX(d.date) as number)
        )
        resolvedLine.attr(
          'd',
          lineResolved.x(d => currentX(d.date) as number)
        )
        content.select('.area-created').attr(
          'd',
          areaCreated.x(d => currentX(d.date) as number)
        )
        content.select('.area-resolved').attr(
          'd',
          areaResolved.x(d => currentX(d.date) as number)
        )
        drawAxes(currentX)
      })

    // ----- Line generators ------------------------------------------------
    const lineCreated = d3
      .line<DataPoint>()
      .x((d: DataPoint) => x(d.date) as number)
      .y((d: DataPoint) => y(d.created))
      .curve(d3.curveMonotoneX)

    const lineResolved = d3
      .line<DataPoint>()
      .x((d: DataPoint) => x(d.date) as number)
      .y((d: DataPoint) => y(d.resolved))
      .curve(d3.curveMonotoneX)

    const areaCreated = d3
      .area<DataPoint>()
      .x((d: DataPoint) => x(d.date) as number)
      .y0(innerHeight)
      .y1((d: DataPoint) => y(d.created))
      .curve(d3.curveMonotoneX)

    const areaResolved = d3
      .area<DataPoint>()
      .x((d: DataPoint) => x(d.date) as number)
      .y0(innerHeight)
      .y1((d: DataPoint) => y(d.resolved))
      .curve(d3.curveMonotoneX)

    // ----- Draw areas and lines ------------------------------------------
    const clipId = `clip-${Date.now()}`
    g.append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)

    const content = g.append('g').attr('clip-path', `url(#${clipId})`)

    content
      .append('path')
      .datum(series)
      .attr('fill', 'url(#gradient-reported)')
      .attr('class', 'area-created')
      .attr('d', areaCreated)

    content
      .append('path')
      .datum(series)
      .attr('fill', 'url(#gradient-resolved)')
      .attr('class', 'area-resolved')
      .attr('d', areaResolved)

    const createdLine = content
      .append('path')
      .datum(series)
      .attr('fill', 'none')
      .attr('stroke', '#f97316')
      .attr('stroke-width', 2)
      .attr('class', 'line-created')
      .attr('d', lineCreated)

    const resolvedLine = content
      .append('path')
      .datum(series)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('class', 'line-resolved')
      .attr('d', lineResolved)

    // ----- Legend ---------------------------------------------------------
    const legend = g
      .append('g')
      .attr('transform', `translate(${innerWidth - 120},0)`)

    legend
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#f97316')
    legend
      .append('text')
      .attr('x', 18)
      .attr('y', 10)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', 12)
      .text('Reported')

    legend
      .append('rect')
      .attr('y', 20)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#10b981')
    legend
      .append('text')
      .attr('x', 18)
      .attr('y', 30)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', 12)
      .text('Resolved')

    // ----- Tooltip -------------------------------------------------------
    const bisectDate = d3.bisector<DataPoint, Date>(d => d.date).left

    const tooltip = g.append('g').style('display', 'none')

    tooltip
      .append('line')
      .attr('id', 'tooltip-line')
      .attr('stroke', '#9ca3af')
      .attr('y1', 0)
      .attr('y2', innerHeight)

    const tooltipBox = tooltip
      .append('rect')
      .attr('fill', '#ffffff')
      .attr('stroke', '#d1d5db')
      .attr('rx', 4)
      .attr('width', 90)
      .attr('height', 38)

    const tooltipDate = tooltip
      .append('text')
      .attr('font-size', 12)
      .attr('dy', '1.2em')

    const tooltipCreated = tooltip
      .append('text')
      .attr('font-size', 12)
      .attr('dy', '2.4em')

    const tooltipResolved = tooltip
      .append('text')
      .attr('font-size', 12)
      .attr('dy', '3.6em')

    const circleCreated = tooltip
      .append('circle')
      .attr('r', 4)
      .attr('fill', '#f97316')

    const circleResolved = tooltip
      .append('circle')
      .attr('r', 4)
      .attr('fill', '#10b981')

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .call(zoomBehavior)
      .on('mouseenter', () => tooltip.style('display', null))
      .on('mouseleave', () => tooltip.style('display', 'none'))
      .on('mousemove', function (event: MouseEvent) {
        const [mx] = d3.pointer(event)
        const xDate = currentX.invert(mx)
        const i = bisectDate(series, xDate, 1)
        const d0 = series[i - 1]
        const d1 = series[i]
        const d =
          !d1 ||
          xDate.getTime() - d0.date.getTime() <
            d1.date.getTime() - xDate.getTime()
            ? d0
            : d1

        const xPos = currentX(d.date) as number
        const boxOffset = xPos > innerWidth - 100 ? -98 : 8

        tooltip.select('#tooltip-line').attr('x1', xPos).attr('x2', xPos)
        circleCreated.attr('cx', xPos).attr('cy', y(d.created))
        circleResolved.attr('cx', xPos).attr('cy', y(d.resolved))
        tooltipBox.attr('x', xPos + boxOffset).attr('y', 4)
        tooltipDate
          .attr('x', xPos + boxOffset + 4)
          .attr('y', 4)
          .text(d3.timeFormat('%b %d')(d.date))
        tooltipCreated
          .attr('x', xPos + boxOffset + 4)
          .attr('y', 4)
          .text(`Reported: ${d.created}`)
        tooltipResolved
          .attr('x', xPos + boxOffset + 4)
          .attr('y', 4)
          .text(`Resolved: ${d.resolved}`)
      })
  }

  /** Setup & teardown ----------------------------------------------------- */
  useEffect(() => {
    renderChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugs, size.width])

  return (
    <ChartWrapper ref={wrapperRef}>
      <ChartSvg ref={svgRef} />
    </ChartWrapper>
  )
}

export default BugTrendsChart
