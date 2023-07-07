import React from 'react'
import { FiCheckCircle } from "react-icons/fi";
import { BiMessageRoundedError } from 'react-icons/bi';
import { GiSandsOfTime } from "react-icons/gi";
import { BsCloudUpload, BsClipboardCheck } from "react-icons/bs";
import { AiOutlineAppstoreAdd } from "react-icons/ai";

function BssStatus(props) {
    var { phases } = props

    return (
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
                                        <div className='count_value'>{phases['completed']["value"]}</div>
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
    )
}

export default BssStatus
