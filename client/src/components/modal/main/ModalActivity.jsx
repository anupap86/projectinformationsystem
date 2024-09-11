import React, { useState, useEffect } from 'react'


const ModalActivity = ({ showModal, onClose, onAdd, onEdit, modalType, editingActivity }) => {
    const [activityData, setActivityData] = useState({
        date: '',
        activity_name: '',
        institute_name: ''
    })

    useEffect(() => {
        if (editingActivity) {
            setActivityData(editingActivity);
        } else {
            setActivityData({
                date: '',
                activity_name: '',
                institute_name: ''
            })
        }
    }, [editingActivity])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingActivity) {
                await onEdit(modalType, activityData.id, activityData);
            } else {
                const newId = `${modalType}-${Date.now().toString()}`;
                await onAdd(modalType, newId, activityData);
            }

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActivityData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }


    return (
        <>
            {showModal &&
                <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor='date'>วันที่กิจกรรม</label>
                                <input
                                    type='date'
                                    name='date'
                                    value={activityData.date}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor='activity_name'>ชื่อกิจกรรม</label>
                                <input
                                    type='text'
                                    name='activity_name'
                                    value={activityData.activity_name}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor='institute_name'>หน่วยงานที่จัด</label>
                                <input
                                    type='text'
                                    name='institute_name'
                                    value={activityData.institute_name}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex justify-between'>
                                <button
                                    className="bg-green-500 hover:bg-green-700 duration-100 text-white font-bold py-2 px-4 rounded mr-2"
                                    type='submit'>
                                    {editingActivity ? 'บันทึก' : 'เพิ่ม'}
                                </button>
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 duration-100 text-white font-bold py-2 px-4 rounded mr-2"
                                    type='button' onClick={onClose}>
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default ModalActivity