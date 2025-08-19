"use client";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// This component is for the date input fields
export const DateInput = ({ onClick }: { onClick: () => void }) => (
    <div
        onClick={onClick}
        className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50 w-40"
    >
        <Calendar size={16} className="text-gray-500 mr-2" />
        <span className="text-sm text-gray-700">20/08/2017</span>
    </div>
);

// This component represents the calendar popup
export const CalendarPopup = ({ onApply, onCancel }: { onApply: () => void, onCancel: () => void }) => (
    <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-[300px] bg-white shadow-2xl p-4 z-10 border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
            {/* Month 1: August */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <button className="hover:bg-gray-100 rounded-full p-1"><ChevronLeft size={18} /></button>
                    <span className="font-bold text-sm">AUG 2017</span>
                    <span className="w-6"></span>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500">
                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day} className="py-1">{day}</div>)}
                    <div className="text-gray-400 py-1">30</div><div className="text-gray-400 py-1">31</div><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
                    <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div>
                    <div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div><div>19</div>
                    <div className="bg-green-600 text-white rounded-full">20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div>
                    <div>27</div><div>28</div><div>29</div><div>30</div><div>31</div><div className="text-gray-400 py-1">1</div><div className="text-gray-400 py-1">2</div>
                    <div className="text-gray-400 py-1">3</div><div className="text-gray-400 py-1">4</div><div className="text-gray-400 py-1">5</div><div className="text-gray-400 py-1">6</div><div className="text-gray-400 py-1">7</div><div className="text-gray-400 py-1">8</div><div className="text-gray-400 py-1">9</div>
                </div>
            </div>
            {/* Month 2: September */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="w-6"></span>
                    <span className="font-bold text-sm">SEP 2017</span>
                    <button className="hover:bg-gray-100 rounded-full p-1"><ChevronRight size={18} /></button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500">
                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day}>{day}</div>)}
                    <div className="text-gray-400">27</div><div className="text-gray-400">28</div><div className="text-gray-400">29</div><div className="text-gray-400">30</div><div className="text-gray-400">31</div><div>1</div><div>2</div>
                    <div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div>
                    <div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div><div>16</div>
                    <div>17</div><div>18</div><div>19</div><div>20</div><div>21</div><div>22</div><div>23</div>
                    <div>24</div><div>25</div><div>26</div><div>27</div><div>28</div><div>29</div><div>30</div>
                </div>
            </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
            <button onClick={onApply} className="bg-green-600 text-white font-bold py-1 px-6 rounded-md text-[13px] hover:bg-green-700">Apply</button>
            <button onClick={onCancel} className="bg-red-600 text-white font-bold py-1 px-6 rounded-md text-[13px] hover:bg-red-700">Cancel</button>
        </div>
    </div>
);