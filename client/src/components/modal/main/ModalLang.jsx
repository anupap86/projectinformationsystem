import React, { useState, useEffect } from 'react';

const ModalLang = ({ showModal, onClose, onAdd, onEdit, editingLang }) => {
    const [language, setLanguage] = useState('');
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [score, setScore] = useState('');

    useEffect(() => {
        if (editingLang) {
            setLanguage(editingLang.language);
            setDate(editingLang.date);
            setName(editingLang.name);
            setScore(editingLang.score);
        }
    }, [editingLang]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (editingLang) {
            onEdit({ ...editingLang, language, date, name, score });
        } else {
            onAdd({ language, date, name, score });
        }
        onClose();
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-xl mb-4">{editingLang ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
                            ภาษา
                        </label>
                        <input
                            required
                            type="text"
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                            วันเวลาที่สอบ
                        </label>
                        <input
                            required
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            ชื่อ
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="score">
                            คะแนน
                        </label>
                        <input
                            required
                            type="number"
                            id="score"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            {editingLang ? 'บันทึก' : 'เพิ่ม'}
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

export default ModalLang;