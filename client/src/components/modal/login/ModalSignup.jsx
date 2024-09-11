import React from 'react'
import { HiCheck } from "react-icons/hi2";

function ModalSignup() {

    const onSubmit = async (e) => {
        window.location.reload();

    }
    return (
        <>

            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity backdrop-blur-sm">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                        <div className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 bg-white">
                                <div className='sm:flex sm:items-start sm:justify-center sm:text-center pb-2'>
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:mx-0 sm:h-10 sm:w-10 ">
                                        <HiCheck className=' text-white h-6 w-6 bg-green-500' fill="none" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="sm:flex sm:items-start flex items-center justify-center text-center">
                                    <div className="mt-3 text-center sm:mt-0  sm:text-left">
                                        <h3 className="sm:text-base font-semibold leading-6 text-gray-900 sm:text-center" id="modal-title">สมัครสำเร็จ</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">กลับไปที่หน้าเข้าสู้ระบบ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" py-3 sm:flex sm:flex-row-reverse  flex items-center justify-center text-center bg-white">
                                <button onClick={onSubmit} type="button" className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm duration-500 hover:bg-slate-700  sm:w-auto">เข้าสู่ระบบ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ModalSignup