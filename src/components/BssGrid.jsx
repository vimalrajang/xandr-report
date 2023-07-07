import React, { useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'chart.js/auto'
import 'ag-grid-enterprise';

function BssGrid(props) {
    const { bssJobs } = props

    const [rowData, setRowData] = useState();
    const [columnDefs] = useState([
        { headerName: "Job Id", field: 'job_id' },
        { headerName: "Status", field: 'phase' },
        { headerName: "Remarks", field: 'error_code', valueFormatter: params => handleRemarks(params) },
    ]);

    const handleRemarks = (data) => {
        if (data.data.phase == "error") {
            return data.data.error_log_lines
        }
        else if (data.data.phase == "completed") {
            if (data.data.segment_log_lines == "") {
                return data.data.error_log_lines
            }
            return data.data.segment_log_lines
        }
        else {
            return "--"
        }
    }
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
        <>
            <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
                <AgGridReact
                    rowData={bssJobs}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                >
                </AgGridReact>
            </div>
        </>
    )
}

export default BssGrid
