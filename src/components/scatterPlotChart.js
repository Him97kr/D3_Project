import { useEffect, useRef } from "react";
import * as d3 from "d3";

export const ScatterPlotChart = ({ dataSet, height, width }) => {
    const d3Chart = useRef(null);

    function getColorByRegion(element) {
        const asiaPacific = [
            "Burundi", "Comoros", "Djibouti", "Eritrea", "Ethiopia", "Kenya", "Madagascar",
            "Malawi", "Mauritius", "Mayotte", "Mozambique", "Réunion", "Rwanda", "Seychelles",
            "Somalia", "South Sudan", "Uganda", "United Republic of Tanzania", "Zambia", "Zimbabwe",
            "China", "China, Hong Kong SAR", "China, Macao SAR", "China, Taiwan Province of China",
            "Japan", "Mongolia", "Republic of Korea", "Kazakhstan", "Kyrgyzstan", "Tajikistan",
            "Turkmenistan", "Uzbekistan", "Australia", "New Zealand", "Fiji", "Papua New Guinea",
            "Solomon Islands", "Vanuatu", "Guam", "Kiribati", "Marshall Islands", "Micronesia (Fed. States of)",
            "Nauru", "Northern Mariana Islands", "Palau", "American Samoa", "Cook Islands", "French Polynesia",
            "Niue", "Samoa", "Tokelau", "Tonga", "Tuvalu", "Wallis and Futuna Islands", "India", "Bangladesh",
            "Indonesia", "Philippines", "Vietnam", "Viet Nam", "Pakistan", "Afghanistan", "Myanmar", "Thailand",
            "Nepal", "Maldives", "Malaysia", "Sri lanka"
        ];

        const america = [
            "United States of America", "Canada", "Mexico", "Brazil", "Argentina", "Anguilla",
            "Antigua and Barbuda", "Aruba", "Bahamas", "Barbados", "Bonaire, Sint Eustatius and Saba",
            "British Virgin Islands", "Cayman Islands", "Cuba", "Curaçao", "Dominica", "Dominican Republic",
            "Grenada", "Guadeloupe", "Haiti", "Jamaica", "Martinique", "Montserrat", "Puerto Rico",
            "Saint Barthélemy", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)",
            "Saint Vincent and the Grenadines", "Sint Maarten (Dutch part)", "Trinidad and Tobago",
            "Turks and Caicos Islands", "United States Virgin Islands", "Belize", "Costa Rica",
            "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama", "Colombia", "Ecuador",
            "Falkland Islands (Malvinas)", "French Guiana", "Guyana", "Paraguay", "Peru", "Suriname",
            "Uruguay", "Venezuela (Bolivarian Republic of)"
        ];

        const europeAfrica = [
            "Germany", "France", "Italy", "Spain", "South Africa", "Algeria", "Egypt", "Libya", "Morocco",
            "Sudan", "Tunisia", "Western Sahara", "Botswana", "Eswatini", "Lesotho", "Namibia", "Benin",
            "Burkina Faso", "Cabo Verde", "Côte d'Ivoire", "Gambia", "Ghana", "Guinea", "Guinea-Bissau",
            "Liberia", "Mali", "Mauritania", "Niger", "Nigeria", "Saint Helena", "Senegal", "Sierra Leone",
            "Togo", "Armenia", "Azerbaijan", "Bahrain", "Cyprus", "Georgia", "Iraq", "Israel", "Jordan",
            "Kuwait", "Lebanon", "Oman", "Qatar", "Saudi Arabia", "State of Palestine", "Syrian Arab Republic",
            "Türkiye", "United Arab Emirates", "Yemen", "Belarus", "Bulgaria", "Czechia", "Hungary", "Poland",
            "Republic of Moldova", "Romania", "Russian Federation", "Slovakia", "Ukraine", "Denmark", "Estonia",
            "Faroe Islands", "Finland", "Guernsey", "Iceland", "Ireland", "Isle of Man", "Jersey", "Latvia",
            "Lithuania", "Norway", "Sweden", "United Kingdom", "Albania", "Andorra", "Bosnia and Herzegovina",
            "Croatia", "Gibraltar", "Greece", "Holy See", "Italy", "Kosovo (under UNSC res. 1244)", "Malta",
            "Montenegro", "North Macedonia", "Portugal", "San Marino", "Serbia", "Slovenia", "Spain", "Austria",
            "Belgium", "France", "Germany", "Liechtenstein", "Luxembourg", "Monaco", "Netherlands", "Switzerland"
        ];

        if (asiaPacific.includes(element)) {
            return "#f5cd3d";
        } else if (america.includes(element)) {
            return "#a738fc";
        } else if (europeAfrica.includes(element)) {
            return "#38aafc";
        } else {
            return "#73716e";
        }
    }

    function findValueByPrefix(object, prefix) {
        for (var property in object) {
            if (object.hasOwnProperty(property) &&
                property.toString().startsWith(prefix)) {
                return object[property];
            }
        }
    }

    function convertToNumberRate(stringNumber) {
        const cleanedString = stringNumber.replace(/[()]/g, "");
        const numberValue = parseFloat(cleanedString);

        if (stringNumber.includes("(")) {
            return -numberValue;
        }

        if (stringNumber.includes("-")) {
            return 0;
        }

        return numberValue;
    }

    function convertToNumberDensity(str) {
        str.trim()
        return parseFloat(str.replace(/,/g, ''));
    }

    function spchart(width, height) {
        try {
            var margin = { top: 40, right: 40, bottom: 50, left: 60 };
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
                .style("overflow", "visible");

            let maxLen = 0;
            let yArr = [];
            let xArr = [];
            let zArr = [];

            dataSet.forEach((data, i) => {
                if (data.arr.length > maxLen) {
                    maxLen = data.arr.length;
                }
                data.arr.forEach((el) => {
                    let rate = convertToNumberRate(findValueByPrefix(el, ' Population_Growth_Rate '))
                    yArr.push(rate);

                    let density = convertToNumberDensity(findValueByPrefix(el, ' Population_Density '))
                    xArr.push(density);

                    let size = convertToNumberDensity(findValueByPrefix(el, ' Population (000s) '))
                    zArr.push(size);
                });
            });

            // var yMaxValue = Math.max(...yArr);
            // var yMinValue = Math.min(...yArr);

            // var xMaxValue = Math.max(...xArr);
            // var xMinValue = Math.min(...xArr);

            var zMaxValue = Math.max(...zArr);
            var zMinValue = Math.min(...zArr);

            const yScale = d3.scaleLinear().domain([-100, 100]).range([h, 0]);
            const xScaleL = d3
                .scaleLinear()
                .domain([0, 1000])
                .range([0, w]);

            let sizeRange = []
            if (window.screen.width > 700) {
                sizeRange = [3, 120]
            } else {
                sizeRange = [3, 70]
            }

            const sizeScale = d3.scaleLinear().domain([zMinValue, zMaxValue]).range(sizeRange);

            var xTick = ['0', '200', '400', '600', ">800"];

            const xAxis = d3
                .axisBottom(xScaleL)
                .ticks(6)
                .tickFormat((d, i) => {
                    return xTick[i];
                })
                .tickSize(0)
                .tickPadding([10]);

            const yAxis = d3
                .axisLeft(yScale)
                .ticks(2)
                .tickSize(0)
                .tickPadding([10]);

            const xAxisGrid = d3.axisBottom(xScaleL)
                .tickSize(-h)
                .ticks(0.5)
                .tickFormat('')
                .tickPadding([10]);

            const yAxisGrid = d3
                .axisLeft(yScale)
                .tickSize(-w)
                .tickFormat("")
                .ticks(1);

            svg.append('g')
                .attr('class', 'x axis-grid')
                .attr('transform', 'translate(' + (w / 14) + ',' + h + ')')
                .attr("stroke", "#D3DAE3")
                .attr("stroke-width", "1")
                .style("stroke-dasharray", "4")
                .style("font-weight", "600")
                .attr("opacity", ".5")
                .call(xAxisGrid);
            svg
                .append("g")
                .attr("class", "y axis-grid")
                .attr("stroke", "#D3DAE3")
                .attr("stroke-width", "1")
                .style("stroke-dasharray", "4")
                .attr("opacity", ".5")
                .call(yAxisGrid);

            var tooltip = d3
                .select('#widgetTooltip')
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("width", "max-content")
                .style("height", "auto")
                .style("border-radius", "6px")
                .style("box-shadow", "0px 4px 4px rgba(0, 0, 0, 0.08)")
                .style("border", "1px solid #D3DAE3")
                .style("background-color", "white")
                .style("visibility", "hidden");

            dataSet.forEach((tempData, index) => {
                svg
                    .append("g")
                    .selectAll("dot")
                    .data(tempData.arr)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d, i) {
                        return xScaleL(convertToNumberDensity(findValueByPrefix(d, ' Population_Density ')));
                    })
                    .attr("cy", function (d) {
                        return yScale(convertToNumberRate(findValueByPrefix(d, ' Population_Growth_Rate ')));
                    })
                    .attr("r", function (d) {
                        return sizeScale(convertToNumberDensity(findValueByPrefix(d, ' Population (000s) ')));
                    })
                    .style("fill", function (d) {
                        return getColorByRegion(d.Country)
                    })
                    .style("stroke", "#434a45")
                    .style("stroke-width", 0.5)
                    .on("mouseover", function () {
                        tooltip.style("visibility", "visible");
                    })
                    .on("mousemove", function (event, d) {
                        tooltip.html(
                            toolTipMaker(d)
                        );

                        var x, y;
                        let maxHeight = (document.documentElement.clientHeight / 100) * 90;
                        let maxWidth = (document.documentElement.clientWidth / 100) * 90;
                        if (event.pageY > maxHeight) {
                            y = 50;
                        } else {
                            y = 10;
                        }

                        if (event.pageX > maxWidth) {
                            x = 200;
                        } else {
                            x = -10;
                        }

                        tooltip
                            .style("top", event.pageY - y + "px")
                            .style("left", event.pageX - x + "px");
                    })
                    .on("mouseout", function () {
                        tooltip.style("visibility", "hidden");
                    });
            });

            svg.append("g").call(xAxis).attr("transform", `translate(0,${h})`);
            svg.append("g").call(yAxis);

            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width / 2)
                .attr("y", height - 45)
                .attr("style", "font-size:14px;font-weight:600")
                .text("Population Density");

            if (window.screen.width > 700) {
                svg.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "middle")
                    .attr("x", width / 14)
                    .attr("y", height - 72)
                    .attr("style", "font-size:10px;font-weight:400")
                    .text("world avg:60");
            }

            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", -50)
                .attr("dy", "1em")
                .attr("style", "font-size:14px;font-weight:600")
                .attr('transform', 'translate(' + (-50) + ', ' + height / 2 + ')')
                .attr('transform', 'rotate(-90)')
                .text("Population Growth (%)");

            svg.selectAll(".domain").attr("stroke", "grey");
        } catch (error) {
            // console.log(error);
        }
    }

    const toolTipMaker = (data) => {
        var str = "";
        for (let key in data) {
            let tempKey = key.trim();
            let tempValue = data[key];

            let bgColor = '#dcf8fa'
            let fontWeight = 400

            if (tempKey == "Population_Density") {
                tempKey = "Population Density"
            }

            if (tempKey == "Country") {
                bgColor = '#d2dbfa'
                fontWeight = 600
            }

            if (tempKey == "Population_Growth_Rate") {
                tempKey = "Population Growth (%)"
                tempValue = convertToNumberRate(data[key])
            }

            str += `<div class='widgetToolTip' style="background-color:${bgColor}">`;
            str += `<div class='widgetToolTipKey'>`;
            str += `${tempKey} :`;
            str += `</div>`;
            str += `<div class='widgetToolTipValue' style="font-weight:${fontWeight}">`;
            str += `${tempValue}`;
            str += `</div>`;
            str += `</div >`;
        }
        return str;
    };

    useEffect(() => {
        spchart(width * 0.93, height * 0.93);
        return () => {
            d3.select("#widgetTooltip").selectAll("*").remove();
        };
    }, []);

    useEffect(() => {
        d3.select(d3Chart.current).selectAll("*").remove();
        spchart(width * 0.93, height * 0.93);
    }, [dataSet]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {dataSet.length > 0 ? <svg ref={d3Chart}></svg> : null}
        </div>
    )
}