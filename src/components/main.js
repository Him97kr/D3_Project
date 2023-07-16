import { LineChart } from "./lineChart"
import population from './population.csv'
import { useEffect, useState } from "react";
import * as d3 from "d3";
import { ScatterPlotChart } from "./scatterPlotChart";
import './main.css';

export const Main = () => {
    const [sourceData, setSourceData] = useState([]);
    const [years, setYears] = useState([]);
    const [currentPopulation, setCurrentPopulation] = useState(0);
    const [selectedYear, setSelectedYear] = useState(0);
    const [lineChartData, setLineChartData] = useState([]);
    const [scatterPlotData, setScatterPlotData] = useState([]);

    function findValueByPrefix(object, prefix) {
        for (var property in object) {
            if (object.hasOwnProperty(property) &&
                property.toString().startsWith(prefix)) {
                return object[property];
            }
        }
    }

    function convertStringNum(str) {
        return parseFloat(str.replace(/,/g, ''));
    }

    function groupByYear(arr) {
        let grp = d3.group(arr, d => d.Year);

        const obj = Object.fromEntries(grp);

        var newArr = []

        for (let key in obj) {
            let newObj = {}
            let sum = d3.sum(obj[key], d => convertStringNum(findValueByPrefix(d, ' Population (000s) ')))
            newObj = {
                year: key,
                totalPopulation: sum
            }
            newArr.push(newObj)
        }

        setCurrentPopulation(newArr[newArr.length - 1]?.totalPopulation);

        return newArr;
    }

    function groupByCountry(arr) {
        let grp = d3.group(arr, d => d.Country);

        const obj = Object.fromEntries(grp);

        let processData = []

        for (let key in obj) {
            let tempObj = {
                id: key,
                arr: obj[key]
            }
            processData.push(tempObj)
        }

        return processData;
    }

    function formatNumber(number) {
        if (number >= 1e6) {
            return (number / 1e6).toFixed(1) + " Bn";
        } else {
            return number.toString();
        }
    }

    useEffect(() => {
        d3.csv(population, function (row) {
            return row;
        }, function (data) {
            return data;
        }).then((data) => {
            setSourceData(data);

            let tempYears = []
            data.forEach((d) => {
                tempYears.push(d.Year)
            })

            let uniqueYears = [...new Set(tempYears)]
            uniqueYears.reverse();
            uniqueYears.pop();
            setYears(uniqueYears);
            setSelectedYear(uniqueYears[0]);

            let tempLineArr = []
            let tempSPArr = []

            tempLineArr = data.filter((d, i) => {
                if (d.Year <= uniqueYears[0]) {
                    return d
                }
            })

            tempSPArr = data.filter((d, i) => {
                if (d.Year == uniqueYears[0]) {
                    return d
                }
            })

            let tempLineData = groupByYear(tempLineArr)
            setLineChartData(tempLineData);

            let tempScatterPlotData = groupByCountry(tempSPArr)
            setScatterPlotData(tempScatterPlotData);
        });
    }, [])

    const handleYearChange = (e) => {
        let tempYear = e.target.value;
        setSelectedYear(tempYear);

        let tempLineArr = []
        let tempSPArr = []

        tempLineArr = sourceData.filter((d, i) => {
            if (d.Year <= tempYear) {
                return d
            }
        })

        tempSPArr = sourceData.filter((d, i) => {
            if (d.Year == tempYear) {
                return d
            }
        })

        let tempLineData = groupByYear(tempLineArr)
        setLineChartData(tempLineData);

        let tempScatterPlotData = groupByCountry(tempSPArr)
        setScatterPlotData(tempScatterPlotData);
    }

    return (
        <div>
            <div id="widgetTooltip"></div>
            <div class='header'>
                <div class='company'>
                    <div>ABC</div>
                    <div>CO</div>
                </div>
            </div>
            <div class='selectionbox'>
                <select class='selectionboxInner' onChange={(e) => handleYearChange(e)}>
                    {years.length > 0 && years.map((d, i) => {
                        return <option class='options' value={d}>Year : {d}</option>
                    })}
                </select>
            </div>
            <div class='topBox'>
                <div class='commonBox'>
                    <div class='leftBox'>
                        <div class='year'>
                            <div>
                                World population
                            </div>
                            <div>
                                {"("}{selectedYear}{")"}
                            </div>
                        </div>
                        {currentPopulation ?
                            <div class='population'>
                                <div>
                                    {formatNumber(currentPopulation).split(' ')[0]?.trim()}
                                </div>
                                <div class='populationSuffix'>
                                    {formatNumber(currentPopulation).split(' ')[1]?.trim()}
                                </div>
                            </div>
                            : null}
                    </div>
                    {window.screen.width > 700 ?
                        <div class='rightBox'>
                            <div class='growth'>
                                Population Growth
                            </div>
                            <div class='lineChart'>
                                <LineChart
                                    dataSet={lineChartData}
                                    height={window.screen.height * 0.2}
                                    width={window.screen.width * 0.25} />
                            </div>
                        </div>
                        : null}
                </div>
            </div>
            <div class='topText'>
                Population Growth vs Density Correlation
            </div>
            <div class='mainChart'>
                <ScatterPlotChart
                    dataSet={scatterPlotData}
                    height={window.screen.height * 0.7}
                    width={window.screen.width} />
            </div>
            <div class='chartStat'>
                <div class='region'>
                    <div class='circle1'></div>
                    Asia and Pacific
                </div>
                <div class='region'>
                    <div class='circle2'></div>
                    Europe and Africa
                </div>
                <div class='region'>
                    <div class='circle3'></div>
                    America
                </div>
                <div class='region'>
                    <div class='circle4'></div>
                    Others
                </div>
            </div>
            <div class='bottomText'>
                Bubble size indicates country's population
            </div>
        </div>
    )
}