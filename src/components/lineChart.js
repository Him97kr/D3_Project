import { useEffect, useRef } from "react";
import * as d3 from "d3";

export const LineChart = ({ dataSet, height, width }) => {
    const d3Chart = useRef(null);

    function formatNumber(number) {
        if (number >= 1e6) {
            return (number / 1e6).toFixed(1) + " Bn";
        } else {
            return number.toString();
        }
    }

    function chart(width, height) {
        try {
            var margin = { top: 20, right: 40, bottom: 20, left: 40 };
            const w = width - margin.left - margin.right;
            const h = height - margin.top - margin.bottom;
            const svg = d3
                .select(d3Chart.current)
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("backgroud", "#d3d3d3")
                .style("margin-top", "50")
                .style("overflow", "visible"); // for axis(outside) visible

            const yScale = d3
                .scaleLinear()
                .domain([0, d3.max(dataSet, d => d.totalPopulation)])
                .range([h, 0]);

            const xScale = d3
                .scaleLinear()
                .domain(d3.extent(dataSet, d => d.year))
                .range([0, w]);

            const areaGenerator = d3
                .area()
                .x(function (d) {
                    return xScale(d.year)
                })
                .y1(function (d) {
                    return yScale(d.totalPopulation)
                })
                .y0(function () {
                    return h
                });

            const generateLine = d3
                .line()
                .y(function (d) {
                    return yScale(d.totalPopulation);
                })
                .defined(function (d) {
                    return d.totalPopulation !== null;
                }) // Omit empty values.
                .x(function (d, i) {
                    return xScale(d.year);
                });

            const xAxis = d3
                .axisBottom(xScale)
                .ticks(1)
                .tickValues([d3.min(dataSet, d => d.year), d3.max(dataSet, d => d.year)])
                .tickSize(0)
                .tickPadding([5]);

            const yAxis = d3
                .axisLeft(yScale)
                .ticks(0)
                .tickSize(0)

            svg.append('path')
                .datum(dataSet)
                .attr('class', 'area')
                .attr('d', areaGenerator)
                .style('opacity', 0.8)
                .style('fill', '#f5cd3d');

            svg.append('path')
                .datum(dataSet)
                .attr('class', 'line')
                .attr('d', generateLine)
                .style('opacity', 0.8)
                .attr('stroke', '#fc7600')
                .attr('stroke-width', 1.5)
                .style('fill', 'none');

            let minYr = d3.min(dataSet, d => d.year)
            let maxYr = d3.max(dataSet, d => d.year)

            let endArr = dataSet.filter((d, i) => {
                if (d.year == minYr || d.year == maxYr) {
                    return d
                }
            })

            svg.selectAll(".val").data(endArr)
                .enter()
                .append('text')
                .attr("x", d => xScale(d.year))
                .attr("y", d => yScale(d.totalPopulation))
                .attr("dy", "-0.5em")
                .attr("text-anchor", "middle")
                .style('font-weight', 600)
                .style('font-size', '12px')
                .text(d => formatNumber(d.totalPopulation));

            svg.append("g").call(xAxis)
                .attr("transform", `translate(0,${h})`)
                .style('font-weight', 600)
                .style('font-size', '12px');

            svg.append("g").call(yAxis);

            svg.selectAll(".domain").attr("stroke", "transparent");
        } catch (error) {
            // console.log(error);
        }
    }

    useEffect(() => {
        d3.select(d3Chart.current).selectAll("*").remove();
        chart(width * 0.93, height * 0.93);
    }, [dataSet]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {dataSet.length > 0 ? <svg ref={d3Chart}></svg> : null}
        </div>
    )
}