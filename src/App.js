import { useEffect, useMemo, useState } from 'react';
import './App.css';
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
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'chart.js/auto'
import 'ag-grid-enterprise';
import { BiSolidErrorAlt } from 'react-icons/bi'
import { FiCheckCircle } from "react-icons/fi";
import { BiMessageRoundedError } from 'react-icons/bi';
import { GiSandsOfTime } from "react-icons/gi";
import { BsCloudUpload, BsClipboardCheck } from "react-icons/bs";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
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
function App() {

  const [loading, setLoading] = useState(true)
  const [jobHistory, setJobHistory] = useState()
  const [jobPerDate, setJobPerDate] = useState()
  const [rowData, setRowData] = useState();
  const [phases, setPhases] = useState({})
  const [totalJobs, setToatalJobs] = useState(0)
  const [columnDefs] = useState([
    { headerName: "Job Id", field: 'job_id' },
    { headerName: "Status", field: 'phase', valueFormatter: params => isNull(params.value) },
    // { headerName: "File Uploaded Time", field: 'uploaded_time', cellRenderer: 'agGroupCellRenderer' },
    // { headerName: "Completed Time", field: 'completed_time' },
    { headerName: "Remarks", field: 'error_code', valueFormatter: params => handleRemarks(params) },
  ]);
  function stringFormatter(params) {
    console.log("params", params)
    return params.value.toUpperCase()
  }
  const labels = ["completed", "processing", "uploading", "validating", "starting", "error"]
  const handleRemarks = (data) => {
    if (data.data.phase == "error") {
      return data.data.error_log_lines
    }
    else if (data.data.phase == "completed") {
      console.log("completed", data.data)
      if (data.data.segment_log_lines == "") {
        return data.data.error_log_lines
      }
      return data.data.segment_log_lines
    }
    else {
      return "--"
    }
  }
  const isNull = (field) => {
    console.log("field", field)
    return field == null || field == "" ? '---' : field
  }
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
      setToatalJobs(res.data.response.count)
      labels.forEach(label => {
        obj[label] = 0
      })
      let dates = []
      res.data.response.batch_segment_upload_job.forEach(function (item) {
        if (item.start_time != null) {

          let date = new Date(item.start_time).toJSON().slice(0, 10)
          console.log("date",date+" - "+item.start_time)
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
      var chartData = labels.map(data => {
        return obj[data]
      })
      var data = {
        labels,
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
      setRowData(res.data.response.batch_segment_upload_job)
      setJobHistory(data)
      setLoading(false)
    }
    )
      .catch(err => {
        console.log(err)
      })
  }, [])
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);


  return (
    <div>
      <div class="content-area">
        <div class="container-fluid">
          {!loading ?

            // <div className="main">
            //   <div className="row mt-3">
            //     <div className="col-md-4">
            //       <div className="box">
            //         <div className="box-header"></div>
            //         <div className="box-top-content">
            //           <div className="inprogress status">
            //             <div className="status-header">In Progress</div>
            //             <div className="status-content">
            //               2
            //             </div>
            //           </div>
            //           <div className="completed status">
            //             <div className="status-header">Completed</div>
            //             <div className="status-content">
            //               2
            //             </div>
            //           </div>
            //           <div className="failed status">
            //             <div className="status-header">Error</div>
            //             <div className="status-content">
            //               2
            //             </div>
            //           </div>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            <div className="main">
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="box">
                    <div className="box-header">File Process</div>
                    <div className="d-flex justify-content-center align-items-center h-100">Work In Progress</div>
                    {/* <div className="box-content">{totalJobs}</div> */}
                    {/* <div className="row">
                      {
                        Object.entries(phases).map((t, k) => {
                          return (
                            <div className="col-md-4 mt-2">

                              <div className="status-box">
                                <div className="box-header">{t[0]}</div>
                                <div className="box-content">
                                  <span className='ml-2'>
                                    {t[1]}
                                  </span>
                                  <span></span>
                                
                                </div>
                              </div>
                            </div>

                          )
                        }
                        )
                      }

                    </div> */}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="box">
                    <div className="box-header">DAP - Sync List</div>
                    <div className="d-flex justify-content-center align-items-center h-100">Work In Progress</div>

                    {/* <div className="box-content">{totalJobs}</div> */}
                    {/* <div className="row">
                      {
                        Object.entries(phases).map((t, k) => {
                          return (
                            <div className="col-md-3 mt-2">

                              <div className="box">
                                <div className="box-header">{t[0]}</div>
                                <div className="box-content">
                                  <span className='ml-2'>
                                    {t[1]}
                                  </span>
                                  <span></span>
                                 
                                </div>
                              </div>
                            </div>

                          )
                        }
                        )
                      }

                    </div> */}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="box">
                    <div className="row">
                      <div className='col-12'>
                        <div className=''>
                          <div className="box-header">Xandr-BSS</div>
                          <div className='row'>
                            <div className='col-4'>
                              <div className='white_board'>
                                <div className='ionc_view'>
                                  <FiCheckCircle />
                                </div>
                                <div className='mini_seprator'>
                                  <div className='mini_title'>Completed</div>
                                  <div className='count_value'>{phases['completed']}</div>
                                </div>
                              </div>
                            </div>
                            <div className='col-4'>
                              <div className='white_board'>
                                <div className='ionc_view inprogress'>
                                  <GiSandsOfTime />
                                </div>
                                <div className='mini_seprator'>
                                  <div className='mini_title'>In Progress</div>
                                  <div className='count_value'>{phases['processing']}</div>
                                </div>
                              </div>
                            </div>
                            <div className='col-4'>
                              <div className='white_board'>
                                <div className='ionc_view instart'>
                                  <AiOutlineAppstoreAdd />
                                </div>
                                <div className='mini_seprator'>
                                  <div className='mini_title'>Starting</div>
                                  <div className='count_value'>{phases['starting']}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-4' >
                              <div className='white_board'>
                                <div className='ionc_view inupload'>
                                  <BsCloudUpload />
                                </div>
                                <div className='mini_seprator'>
                                  <div className='mini_title'>Uploading</div>
                                  <div className='count_value'>{phases['uploading']}</div>
                                </div>
                              </div>
                            </div>
                            <div className='col-4'>
                              <div className='white_board'>
                                <div className='ionc_view inValidate'>
                                  <BsClipboardCheck />
                                </div>
                                <div className='mini_seprator'>
                                  <div className='mini_title'>Validation</div>
                                  <div className='count_value'>{phases['validating']}</div>
                                </div>
                              </div>
                            </div>
                            <div className='col-4'>
                              <div className='white_board'>
                                <div className='ionc_view inerror'>
                                  <BiMessageRoundedError />
                                </div>
                                <div className='mini_seprator'>
                                  <div className='mini_title'>Failed</div>
                                  <div className='count_value'>{phases['error']}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                {/* <div className="col-md-9">



                </div> */}
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
                    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
                      <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        autoGroupColumnDef={autoGroupColumnDef}
                      >
                      </AgGridReact>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <p>Loading....</p>
          }
        </div>
      </div>
    </div >
  );
}

export default App;
