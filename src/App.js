import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom'
import { FiCheckCircle } from "react-icons/fi";
import { BiMessageRoundedError } from "react-icons/bi";
import { GiSandsOfTime } from "react-icons/gi";
import { BsCloudUpload, BsClipboardCheck } from "react-icons/bs";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import Chart from "react-apexcharts";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'chart.js/auto'
import 'ag-grid-enterprise';

import './App.css';
import axios from 'axios';

function App() {

  const [loading, setLoading] = useState(true)
  const [rowData, setRowData] = useState();
  const [columnDefs] = useState([
    { headerName: "Phase", field: 'phase' },
    { headerName: "File Uploaded Time", field: 'uploaded_time', cellRenderer: 'agGroupCellRenderer' },
    { headerName: "Completed Time", field: 'completed_time' },
    { headerName: "Error Code", field: 'error_code' },
  ]);
  
  var options = {
    series: [53, 45,34,50,62,33],
    chart: {
    type: 'radialBar',
    width: 40,
    height: 40,
    sparkline: {
      enabled: true
    }
  },
  
  dataLabels: {
    enabled: true
  },
  tooltip: {
    enabled: true,
    style: {
      fontSize: '16px',
      fontFamily: "Nunito",
      fontWeight: 600,
      fillSeriesColor: false,
    },
  },
  stroke: {
    lineCap: 'round',
    width: 1,
  },
  labels:["Completed", "Starting", "Uploading", "Validating", "Processing", "Error"],
  colors: ['#26bf94','#0dcaf0', '#864ae8', '#e791bc', '#F2B64C', '#dc3545'],
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 0,
        size: '30%'
      },
      track: {
        margin: 8,
        background: '#e9ecef',
        strokeWidth: 10,
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: '16px',
          fontFamily: "Nunito",
          fontWeight: 600,
          fillSeriesColor: false,
        },
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: '16px',
          fontFamily: "Nunito",
          fontWeight: 600,
          color: "#777",
          offsetY: -10
        },
        value: {
          show: true,
          fontSize: '16px',
          fontFamily: 'Nunito',
          fontWeight: 700,
          color: "#111",
          offsetY: 0,
          formatter: function (val) {
            return val
          }
        },
        total: {
          show: true,
          label: 'Total',
          formatter: function (w) {
            return 249
          }
        },
      },
      
    }
  }
  };

  var chart2OPtion = {
    series: [{
    name: "Count",
    data: [21, 9, 7, 14, 18, 4]
  }],
    chart: {
    height: 350,
    type: 'bar',
      animations: {
        enabled: false
    },
    
  },
  states: { 
    hover: {
        filter: {
            type: 'none',
        }
    },
    active: { 
        filter: {
            type: 'none', 
        }
    },
},
  plotOptions: {
    bar: {
      columnWidth: '45%',
      distributed: true,
      borderbottomRadius: 20,
    }
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false
  },
  colors: ['#26bf94','#0dcaf0', '#864ae8', '#e791bc', '#F2B64C', '#dc3545'],
  xaxis: {
    categories: ["Completed", "Starting", "Uploading", "Validating", "Processing", "Error"],
    labels: {
      style: {
        colors: "#333",
        fontSize: '12px',
        fontFamily: "Nunito",
        fontWeight: 600,
      }
    }
  }
  };

  var chart3Options = {
    series: [53, 45,34,50,62,33],
    chart: {
    type: 'donut',
    width: 40,
    height: 40,
    sparkline: {
      enabled: true
    }
  },
  
  dataLabels: {
    enabled: false
  },
  tooltip: {
    enabled: true,
    style: {
      fontSize: '16px',
      fontFamily: "Nunito",
      fontWeight: 600,
      fillSeriesColor: false,
    },
    marker: {
      show: false,
    },
    onDatasetHover: {
      highlightDataSeries: false,
  },
  },
  fill: {
    colors: ['#26bf94','#0dcaf0', '#864ae8', '#e791bc', '#F2B64C', '#dc3545'],
    type: 'gradient',
    
  },
  stroke: {
    lineCap: 'round',
    opacity: 1,
    width: 1,
  },
  labels:["Completed", "Starting", "Uploading", "Validating", "Processing", "Error"],
  colors: ['#26bf94','#0dcaf0', '#864ae8', '#e791bc', '#F2B64C', '#dc3545'],
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '16px',
            fontFamily: "Nunito",
            fontWeight: 600,
            color: "#777",
            offsetY: -10
          },
          value: {
            show: true,
            fontSize: '16px',
            fontFamily: 'Nunito',
            fontWeight: 700,
            color: "#111",
            offsetY: 0,
            formatter: function (val) {
              return val
            }
          },
          total: {
            show: true,
            label: 'Total',
            fontSize: '16px',
            fontFamily: "Nunito",
            fontWeight: 600,
            color: "#777",
            formatter: function (w) {
              return 142
            }
          }
        }
      }
    }
  },
  };

  useEffect(() => {
    axios.get("http://localhost:30373/api/xandr/advertiser").then(res => {
      setRowData(res.data.response.batch_segment_upload_job)
      setLoading(false)
    }
    ).catch(err => {
        console.log(err)
      })
  }, []);
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
    <div className="App">
      {!loading ?
        <section className='report_page'>
          <div className='page_titile'>Job Reports</div>
              <div className='row'>
                <div className='col-2'>
                  <div className='white_board'>
                    <div className='ionc_view'>
                      <FiCheckCircle />
                    </div>
                    <div className='mini_seprator'>
                      <div className='mini_title'>Completed</div>
                      <div className='count_value'>10</div>
                    </div>
                  </div>
                </div>
                <div className='col-2'>
                  <div className='white_board'>
                    <div className='ionc_view inprogress'>
                      <GiSandsOfTime />
                    </div>
                    <div className='mini_seprator'>
                      <div className='mini_title'>In Progress</div>
                      <div className='count_value'>02</div>
                    </div>
                  </div>
                </div>
                <div className='col-2'>
                  <div className='white_board'>
                    <div className='ionc_view instart'>
                      <AiOutlineAppstoreAdd />
                    </div>
                    <div className='mini_seprator'>
                      <div className='mini_title'>Starting</div>
                      <div className='count_value'>06</div>
                    </div>
                  </div>
                </div>
                <div className='col-2'>
                  <div className='white_board'>
                    <div className='ionc_view inupload'>
                      <BsCloudUpload />
                    </div>
                    <div className='mini_seprator'>
                      <div className='mini_title'>Uploading</div>
                      <div className='count_value'>04</div>
                    </div>
                  </div>
                </div>
                <div className='col-2'>
                  <div className='white_board'>
                    <div className='ionc_view inValidate'>
                      <BsClipboardCheck />
                    </div>
                    <div className='mini_seprator'>
                      <div className='mini_title'>Validation</div>
                      <div className='count_value'>07</div>
                    </div>
                  </div>
                </div>
                <div className='col-2'>
                  <div className='white_board'>
                    <div className='ionc_view inerror'>
                      <BiMessageRoundedError />
                    </div>
                    <div className='mini_seprator'>
                      <div className='mini_title'>Failed</div>
                      <div className='count_value'>08</div>
                    </div>
                  </div>
                </div>
              </div>
              <section className='three_charts_wrapper'>
                <div className='row'>
                  <div className='col-4'>
                    <div className='white_main_board'>
                      <div className='mini_bar_title'>S3 Cron Jobs - Bombora <Link className='view_all' to="/">View All</Link></div>
                      <Chart options={options} series={options.series} type={options.chart.type} height={380} />
                    </div>
                  </div>
                  <div className='col-4'>
                    <div className='white_main_board'>
                      <div className='mini_bar_title'>Sync API - List Jobs <Link className='view_all' to="/">View All</Link></div>
                      <Chart options={chart2OPtion} series={chart2OPtion.series} type={chart2OPtion.chart.type} height={380} />
                    </div>
                  </div>
                  <div className='col-4'>
                    <div className='white_main_board'>
                      <div className='mini_bar_title'>Xandr BSS Cron Jobs <Link className='view_all' to="/">View All</Link></div>
                      <Chart options={chart3Options} series={chart3Options.series} type={chart3Options.chart.type} height={380} />
                    </div>
                  </div>
                </div>
              </section>
              <section className='white_main_board'>
                <div className='table_title'>Job Lists</div>
                <div className='table_container'>
                  <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
                    <AgGridReact
                      rowData={rowData}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      autoGroupColumnDef={autoGroupColumnDef}
                    >
                    </AgGridReact>
                  </div>
                </div>      
              </section>
        </section>
        : <p style={{ color: "white" }}>Loading...</p>
      }
    </div>
  );
}

export default App;
