import React, { useState, useEffect } from 'react';


const ModalTraining = ({ showModal, onClose, onAdd, onEdit, modalType, editingTraining }) => {
    const [trainingData, setTrainingData] = useState({
        date: '',
        trainer: '',
        department: '',
        location: '',
    });

    useEffect(() => {
        if (editingTraining) {
            setTrainingData(editingTraining);
        } else {
            setTrainingData({
                date: '',
                trainer: '',
                department: '',
                location: '',
            });
        }
    }, [editingTraining]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingTraining) {
                await onEdit(modalType, trainingData.id, trainingData);
            } else {
                const newId = `${modalType}-${Date.now().toString()}`;
                await onAdd(modalType, newId, trainingData);
            }

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTrainingData(prevData => ({
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
                                <label htmlFor='date'>วันที่ฝึกอบรม</label>
                                <input
                                    type='date'
                                    name='date'
                                    value={trainingData.date}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor='trainer'>หัวข้อฝึกอบรม </label>
                                <input
                                    type='text'
                                    name='trainer'
                                    value={trainingData.trainer}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor='department'>หน่วยงาน</label>
                                <input
                                    type='text'
                                    name='department'
                                    value={trainingData.department}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor='location'>สถานที่ฝึกอบรม</label>
                                <input
                                    type='text'
                                    name='location'
                                    value={trainingData.location}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex justify-between'>
                                <button
                                    className="bg-green-500 hover:bg-green-700 duration-100 text-white font-bold py-2 px-4 rounded mr-2"
                                    type='submit'>{editingTraining ? 'บันทึก' : 'เพิ่ม'}
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

export default ModalTraining;