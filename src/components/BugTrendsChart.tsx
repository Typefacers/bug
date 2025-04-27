import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Bug } from "../types/bug";

/**
 * Interactive line chart that tracks how many bugs were reported
 * and resolved on each calendar day.
 *
 * • Resizes automatically with its container (ResizeObserver).
 * • Displays a friendly "No data" placeholder if nothing to plot.
 */
const BugTrendsChart = ({ bugs }: { bugs: Bug[] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  /** Main render routine -------------------------------------------------- */
  const renderChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // wipe previous

    const parent = svgRef.current?.parentElement;
    if (!parent) return;

    // ----- Dimensions (responsive) ---------------------------------------
    const containerWidth = parent.clientWidth || 640;
    const margin = { top: 20, right: 20, bottom: 35, left: 48 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = 320 - margin.top - margin.bottom;

    svg
      .attr("width", containerWidth)
      .attr("height", innerHeight + margin.top + margin.bottom)
      .attr(
        "viewBox",
        `0 0 ${containerWidth} ${innerHeight + margin.top + margin.bottom}`,
      )
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ----- Data wrangling -------------------------------------------------
    const floor = d3.timeDay.floor;

    const created = d3.rollup(
      bugs.filter((b) => b.createdAt),
      (v: Bug[]) => v.length,
      (b: Bug) => floor(new Date(b.createdAt!)),
    );

    const resolved = d3.rollup(
      bugs.filter((b) => b.resolvedAt),
      (v: Bug[]) => v.length,
      (b: Bug) => floor(new Date(b.resolvedAt!)),
    );

    const allDays = Array.from(
      new Set([...created.keys(), ...resolved.keys()]),
    ).sort((a, b) => a.getTime() - b.getTime());

    if (allDays.length === 0) {
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("fill", "#6b7280") // gray-500
        .text("No data to display");
      return;
    }

    interface DataPoint {
      date: Date;
      created: number;
      resolved: number;
    }

    const series = allDays.map((d) => ({
      date: d,
      created: created.get(d) ?? 0,
      resolved: resolved.get(d) ?? 0,
    }));

    // ----- Scales ---------------------------------------------------------
    const x = d3.scaleTime().domain(d3.extent(allDays) as [Date, Date]).range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(series, (d: DataPoint) => Math.max(d.created, d.resolved)) || 1,
      ])
      .nice()
      .range([innerHeight, 0]);

    // ----- Axes -----------------------------------------------------------
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickSizeOuter(0)
          .tickFormat(d3.timeFormat("%b %d") as any),
      );

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
      .call((selection: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        selection.selectAll("text").attr("dx", "-0.25em"),
      );

    // ----- Line generators ------------------------------------------------
    const lineCreated = d3
      .line<DataPoint>()
      .x((d: DataPoint) => x(d.date) as number)
      .y((d: DataPoint) => y(d.created))
      .curve(d3.curveMonotoneX);

    const lineResolved = d3
      .line<DataPoint>()
      .x((d: DataPoint) => x(d.date) as number)
      .y((d: DataPoint) => y(d.resolved))
      .curve(d3.curveMonotoneX);

    // ----- Draw lines -----------------------------------------------------
    g.append("path")
      .datum(series)
      .attr("fill", "none")
      .attr("stroke", "#f97316") // orange-500
      .attr("stroke-width", 2)
      .attr("d", lineCreated);

    g.append("path")
      .datum(series)
      .attr("fill", "none")
      .attr("stroke", "#10b981") // emerald-500
      .attr("stroke-width", 2)
      .attr("d", lineResolved);

    // ----- Legend ---------------------------------------------------------
    const legend = g.append("g").attr("transform", `translate(${innerWidth - 120},0)`);

    legend.append("rect").attr("width", 12).attr("height", 12).attr("fill", "#f97316");
    legend
      .append("text")
      .attr("x", 18)
      .attr("y", 10)
      .attr("alignment-baseline", "middle")
      .attr("font-size", 12)
      .text("Reported");

    legend.append("rect").attr("y", 20).attr("width", 12).attr("height", 12).attr("fill", "#10b981");
    legend
      .append("text")
      .attr("x", 18)
      .attr("y", 30)
      .attr("alignment-baseline", "middle")
      .attr("font-size", 12)
      .text("Resolved");
  };

  /** Setup & teardown ----------------------------------------------------- */
  useEffect(() => {
    // Initial render
    renderChart();

    // Observe container resize
    const parent = svgRef.current?.parentElement;
    if (parent && !resizeObserver.current) {
      resizeObserver.current = new ResizeObserver(() => renderChart());
      resizeObserver.current.observe(parent);
    }

    return () => {
      if (resizeObserver.current && parent) {
        resizeObserver.current.unobserve(parent);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugs]); // re-render when data changes

  return <svg ref={svgRef} className="w-full h-80 select-none" />;
};

export default BugTrendsChart;