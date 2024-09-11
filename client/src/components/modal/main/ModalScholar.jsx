import React, { useState, useEffect } from 'react'


const ModalScholar = ({ showModal, onClose, onAdd, onEdit, editingScholar }) => {
    const [year, setYear] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [issuer, setIssuer] = useState('');

    useEffect(() => {
        if (editingScholar) {
            setYear(editingScholar.year);
            setName(editingScholar.name);
            setType(editingScholar.type);
            setIssuer(editingScholar.issuer);
        }
    }, [editingScholar]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (editingScholar) {
            onEdit({ ...editingScholar, year, name, type, issuer });
        } else {
            onAdd({ year, name, type, issuer });
        }
        onClose();
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-xl mb-4">{editingScholar ? 'แก้ไขทุนการศึกษา' : 'เพิ่มทุนการศึกษา'}</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            ชื่อทุน
                        </label>
                        <input
                            required
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                            ประเภททุน
                        </label>
                        <input
                            required
                            type="text"
                            id="Type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Issuer">
                            ผู้มอบทุน
                        </label>
                        <input
                            required
                            type="text"
                            id="issuer"
                            value={issuer}
                            onChange={(e) => setIssuer(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                            ชั้นปีที่ได้รับ
                        </label>
                        <select
                            required
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value=''>เลือกชั้นปีที่ได้รับ</option>
                            <option value='1'>ปี 1</option>
                            <option value='2'>ปี 2</option>
                            <option value='3'>ปี 3</option>
                            <option value='4'>ปี 4</option>
                        </select>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            {editingScholar ? 'บันทึก' : 'เพิ่ม'}
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
};

export default ModalScholar;