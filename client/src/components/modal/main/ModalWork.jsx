import React, { useState, useEffect } from 'react'


const ModalWork = ({ showModal, onClose, onAdd, onEdit, editingWorkEx }) => {
    const [year, setYear] = useState('');
    const [companyname, setCompanyName] = useState('');
    const [role, setRole] = useState('');
    const [income, setIncome] = useState('');

    useEffect(() => {
        if (editingWorkEx) {
            setYear(editingWorkEx.year);
            setCompanyName(editingWorkEx.companyname);
            setRole(editingWorkEx.role);
            setIncome(editingWorkEx.income)
        }
    }, [editingWorkEx])

    const onSubmit = (e) => {
        e.preventDefault();
        if (editingWorkEx) {
            onEdit({ ...editingWorkEx, year, companyname, role, income });
        } else {
            onAdd({ year, companyname, role, income });
        };
        onClose();
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-xl mb-4">{editingWorkEx ? 'แก้ไขข้อมูลงาน' : 'เพิ่มข้อมูลการทำงาน'}</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                            ชื่อบริษัท
                        </label>
                        <input
                            required
                            type="text"
                            id="companyname"
                            value={companyname}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                            ตำแหน่ง
                        </label>
                        <input
                            required
                            type="text"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            เงินเดือน
                        </label>
                        <select
                            required
                            id="income"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value=''>เลือกเงินเดือน</option>
                            <option value='ต่ำกว่า 10000'>ต่ำกว่า 10000</option>
                            <option value='10000-20000'>10000-20000</option>
                            <option value='20000-30000'>20000-30000</option>
                            <option value='30000-40000'>30000-40000</option>
                            <option value='40000-50000'>40000-50000</option>
                            <option value='มากกว่า 50000'>มากกว่า 50000</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="score">
                            ปีทีได้ทำงาน
                        </label>
                        <input
                            required
                            type="text"
                            id="year"
                            placeholder='ค.ศ.'
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            {editingWorkEx ? 'บันทึก' : 'เพิ่ม'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalWork