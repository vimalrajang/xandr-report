import { useEffect, useMemo, useState } from 'react';
import React from 'react'
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Chart, PointElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { bssPhases } from "../constants"
import BssStatus from './BssStatus';
import BssGrid from './BssGrid';
import FileProcess from './FileProcess';
import DapSyncList from './DapSyncList';
Chart.register(PointElement);
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Home() {

    const [bssJobs, setBssJobs] = useState()
    const [loading, setLoading] = useState(true)
    const [jobHistory, setJobHistory] = useState()
    const [jobPerDate, setJobPerDate] = useState()
    const [phases, setPhases] = useState({})



    const options = {
        indexAxis: "x",
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#FFFFFF",
                },
            },
        },
        scales: {
            y: {
                grid: {
                    drawBorder: true,
                    drawOnChartArea: false,
                    color: "#000000",
                },
                ticks: {
                    color: "black",
                    fontSize: 12,
                },
            },
            x: {
                grid: {
                    drawOnChartArea: false,
                    color: "#000000",
                },
                ticks: {
                    color: "black",
                    fontSize: 12,
                },
            },
        },
    };
    const lineOptions = {
        responsive: true,
        scales: {
            y: {
                grid: {
                    drawBorder: true,
                    drawOnChartArea: false,
                    color: "#000000",
                },
                ticks: {
                    color: "black",
                    fontSize: 12,
                },
            },
            x: {
                grid: {
                    drawOnChartArea: false,
                    color: "#000000",
                },
                ticks: {
                    color: "black",
                    fontSize: 12,
                },
            },
        },
    };
    useEffect(() => {

        axios.get("http://localhost:9108/api/xandr/advertiser").then(res => {
            var obj = {};
            setBssJobs(res.data.response.batch_segment_upload_job)
            bssPhases.forEach(label => {
                obj[label] = 0
            })
            let dates = []
            res.data.response.batch_segment_upload_job.forEach(function (item) {
                if (item.start_time != null) {

                    let date = new Date(item.start_time).toJSON().slice(0, 10)
                    dates.push(date)
                }
            });
            // dates.sort(function (a, b) {
            //   return new Date(b.date) - new Date(a.date);
            // })
            let dateObj = {}
            dates.forEach(data => { dateObj[data] = 0 })
            res.data.response.batch_segment_upload_job.forEach(function (item) {
                obj[item.phase]++
                dateObj[new Date(item.start_time).toJSON().slice(0, 10)]++
            });
            dates = Object.keys(dateObj)
            let lineChartData = dates.map(data => {
                return dateObj[data]
            })
            setPhases(obj)
            var chartData = bssPhases.map(data => {
                return obj[data]
            })
            var data = {
                bssPhases,
                datasets: [
                    {
                        label: "Jobs",
                        data: chartData,
                        backgroundColor: [
                            'rgb(170, 255, 0)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(255,51,51)'

                        ],
                    }
                ]
            };
            var lineData = {
                labels: dates,
                datasets: [
                    {
                        label: 'Jobs Per Day',
                        data: lineChartData,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgb(54, 162, 235)',
                    }
                ]
            };
            setJobPerDate(lineData)
            setJobHistory(data)
            setLoading(false)
        }
        )
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <>
            <div class="content-area">
                <div class="container-fluid">
                    {!loading ?
                        <div className="main">
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <FileProcess />
                                </div>
                                <div className="col-md-4">
                                    <DapSyncList />
                                </div>
                                <div className="col-md-4">
                                    <BssStatus phases={phases} />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 ">
                                    <div style={{ width: "100%" }} className='box'>
                                        <div className="box-header">Xandr-BSS</div>
                                        <Bar options={options} data={jobHistory} />
                                    </div>
                                </div>
                                <div className="col-md-6 ">
                                    <div style={{ width: "100%" }} className='box'>
                                        <Line options={lineOptions} data={jobPerDate} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mt-3">
                                    <div className="box">
                                        <BssGrid bssJobs={bssJobs} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <p>Loading....</p>
                    }
                </div>
            </div>
        </>
    )
}

export default Home
