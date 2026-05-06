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
    const [latestPopulationData, setLatestPopulationData] = useState([]);
    const [latestPopulationFlag, setLatestPopulationFlag] = useState(false);
    const currentYear = new Date().getFullYear().toString();
    const mobileView = window.innerWidth < 700

    function findValueByPrefix(obj, prefix) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property) &&
                property.toString().startsWith(prefix)) {
                return obj[property];
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

        setTotalPopulation(newArr);

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

    const convertNumberToThousand = (number) => {
        return Math.ceil(number / 1000).toLocaleString();
    }

    const setTotalPopulation = (arr) => {
        setCurrentPopulation(arr[arr.length - 1]?.totalPopulation);
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

            //get latest population data on page load from restcountries api for correct lineChart 
            handleLatestPopulationClick();
        });
    }, [])

    useEffect(() => {
        if (latestPopulationData.length > 0) {
            let tempCurrentYearLineData = groupByYear(latestPopulationData)
            const tempData = sourceData.filter((d, i) => {
                if (d.Year <= currentYear) {
                    return d
                }
            })
            const tempLineData = [...groupByYear(tempData), ...tempCurrentYearLineData]
            setLineChartData(tempLineData);
            setTotalPopulation(tempLineData);

            let tempScatterPlotData = groupByCountry(latestPopulationData)
            setScatterPlotData(tempScatterPlotData);
        }
    }, [latestPopulationData])

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
        setTotalPopulation(tempLineData);

        let tempScatterPlotData = groupByCountry(tempSPArr)
        setScatterPlotData(tempScatterPlotData);
    }

    const handleLatestPopulationClick = () => {
        setLatestPopulationFlag(!latestPopulationFlag);
        setSelectedYear(currentYear);
        document.getElementById('yearSelect').selectedIndex = 0;

        fetch('https://restcountries.com/v4/all?fields=name,density,population')
            .then(response => response.json())
            .then(data => {
                const tempData = data.map((d, i) => {
                    return {
                        'Country': d?.name?.common,
                        'Year': currentYear,
                        ' Population_Density ': d?.density?.toString(),
                        ' Population (000s) ': convertNumberToThousand(d?.population),
                        ' Population_Growth_Rate ': '0'
                    }
                })
                setLatestPopulationData(tempData);
            })
            .catch(error => console.error('Error:', error));
    }

    return (
        <div class='main'>
            <div id="widgetTooltip"></div>
            <div class='header'>
                <div class='world'>
                    <div>World Population Data</div>
                </div>
            </div>
            <div class='category'>
                <div class='categoryLeft'>
                    <div class='latestPopulation' onClick={handleLatestPopulationClick}>
                        Latest Population Data
                    </div>
                </div>

                <div class='categoryRight'>
                    <div>For Population Data from 1951 to 2021</div>
                    <select id='yearSelect' class='selectionbox' onChange={(e) => handleYearChange(e)}>
                        <option disabled selected class='options' value={0}>Select Year</option>
                        {years.length > 0 && years.map((d, i) => {
                            return <option key={i} class='options' value={d}>Year : {d}</option>
                        })}
                    </select>
                </div>
            </div>
            <div class='topBox'>
                <div class='commonBox' style={{ flexDirection: mobileView ? 'column' : 'row' }}>
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
                    <div class='rightBox'>
                        <div class='growth'>
                            Population Growth
                        </div>
                        <div class='lineChart'>
                            <LineChart
                                dataSet={lineChartData}
                                height={window.screen.height * 0.2}
                                width={mobileView ? window.screen.width * 0.80 : window.screen.width * 0.25} />
                        </div>
                    </div>
                </div>
            </div>
            <div class='topText'>
                Population Growth vs Density Correlation
            </div>
            <div class='mainChart'>
                <ScatterPlotChart
                    selectedYear={selectedYear}
                    dataSet={scatterPlotData}
                    height={mobileView ? window.screen.height * 0.6 : window.screen.height * 0.7}
                    width={window.screen.width * 0.95} />
            </div>
            <div class='chartStat' style={{ flexDirection: mobileView ? 'column' : 'row' }}>
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