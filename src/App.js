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
  const [columnDefs] = useState([
    { headerName: "Phase", field: 'phase' },
    { headerName: "File Uploaded Time", field: 'uploaded_time', cellRenderer: 'agGroupCellRenderer' },
    { headerName: "Completed Time", field: 'completed_time' },
    { headerName: "Error Code", field: 'error_code' },
  ]);

  const labels = ["error", "starting", "uploading", "validating", "processing", "completed"]

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
          color: "#FFFFFF",
        },
        ticks: {
          color: "white",
          fontSize: 12,
        },
      },
      x: {
        grid: {
          drawOnChartArea: false,
          color: "#FFFFFF",
        },
        ticks: {
          color: "white",
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
          color: "#FFFFFF",
        },
        ticks: {
          color: "white",
          fontSize: 12,
        },
      },
      x: {
        grid: {
          drawOnChartArea: false,
          color: "#FFFFFF",
        },
        ticks: {
          color: "white",
          fontSize: 12,
        },
      },
    },
  };
  useEffect(() => {

    axios.get("http://localhost:9108/api/xandr/advertiser").then(res => {
      var obj = {};
      labels.forEach(label => {
        obj[label] = 0
      })
      let dates = []
      res.data.response.batch_segment_upload_job.forEach(function (item) {
        let date = new Date(item.start_time).toJSON().slice(0, 10)
        dates.push(date)
      });
      dates.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      })
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
              'rgb(255,51,51)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(170, 255, 0)'
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
    <div className="App">
      {loading == false
        ?
        <div className='chart-container'>
          <div className='bar-container'>
            <span style={{ width: "100%" }}>
              <Bar options={options} data={jobHistory} />
            </span>
            <span style={{ width: "100%" }}>
              <Line options={lineOptions} data={jobPerDate} />
            </span>
          </div>
          <div className='table-container'>
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
        : <p style={{ color: "white" }}>Loading...</p>
      }
    </div>
  );
}

export default App;
