import React, { useState, useEffect } from 'react';


const ModalReward = ({ showModal, onClose, onAdd, onEdit, modalType, editingReward }) => {
    const [rewardData, setrewardData] = useState({
        reward_name: '',
        level: '',
        type: '',
        issuer: '',
        year: '',
        received_date: '',
    });

    const resetFormData = () => {
        setrewardData({
            reward_name: '',
            level: '',
            type: '',
            issuer: '',
            year: '',
            received_date: '',
        });
    };

    useEffect(() => {
        if (editingReward) {
            setrewardData(editingReward);
        } else {
            setrewardData({
                reward_name: '',
                level: '',
                type: '',
                issuer: '',
                year: '',
                received_date: '',
            });
        }
    }, [editingReward])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setrewardData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingReward) {
                await onEdit(modalType, rewardData.id, rewardData);
            } else {
                const newId = `${modalType}-${Date.now().toString()}`
                await onAdd(modalType, newId, rewardData);
                resetFormData();
            }
            onClose();
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <>
            {showModal &&
                <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor="reward_name">ชื่อรางวัล</label>
                                <input
                                    type='text'
                                    name='reward_name'
                                    value={rewardData.reward_name}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor="level">ระดับรางวัล</label>
                                <input
                                    type='text'
                                    name='level'
                                    value={rewardData.level}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor="type">ประเภทรางวัล</label>
                                <select
                                    name='type'
                                    value={rewardData.type}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                >
                                    <option value=''>เลือกประเภทรางวัล</option>
                                    <option value='เกียรติบัตร'>เกียรติบัตร</option>
                                    <option value='แข่งขัน'>แข่งขัน</option>
                                </select>
                            </div>
                            <div className='flex flex-col mb-4'>
                                <label htmlFor="issuer">ผู้ที่มอบรางวัล</label>
                                <input
                                    type='text'
                                    name='issuer'
                                    value={rewardData.issuer}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            {modalType === 'work' ? (
                                <></>
                            ) : (
                                <div className='flex flex-col mb-4'>
                                    <label htmlFor="year">ชั้นปีที่ได้รางวัล</label>
                                    <select
                                        name='year'
                                        value={rewardData.year}
                                        onChange={handleInputChange}
                                        required
                                        className='border border-gray-300 rounded px-3 py-2'
                                    >
                                        <option value=''>เลือกชั้นปีที่ได้รับ</option>
                                        <option value='1'>ปี 1</option>
                                        <option value='2'>ปี 2</option>
                                        <option value='3'>ปี 3</option>
                                        <option value='4'>ปี 4</option>
                                    </select>
                                </div>
                            )}

                            <div className='flex flex-col mb-4'>
                                <label htmlFor='received_date'>วันที่ฝึกอบรม</label>
                                <input
                                    type='date'
                                    name='received_date'
                                    value={rewardData.received_date}
                                    onChange={handleInputChange}
                                    required
                                    className='border border-gray-300 rounded px-3 py-2'
                                />
                            </div>
                            <div className='flex justify-between'>
                                <button
                                    className="bg-green-500 hover:bg-green-700 duration-100 text-white font-bold py-2 px-4 rounded mr-2"
                                    type='submit'>
                                    {editingReward ? 'บันทึก' : 'เพิ่ม'}
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

export default ModalReward