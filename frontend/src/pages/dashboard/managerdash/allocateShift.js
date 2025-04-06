
import React from 'react';

const AllocateShift = ({ newShift, setNewShift, handleAddShift, staffDatas }) => (
  <div className="shift-allocation">
    <h2>Allocate Shifts</h2>
    <div className="shift-form">
      <label>
        Staff:
        <select
          value={newShift.staffName}
          onChange={(e) => setNewShift({ ...newShift, staffName: e.target.value })}
        >
          <option value="">Select Staff</option>
          {staffDatas.map((staff) => (
            <option key={staff.id} value={staff.name}>
              {staff.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date:
        <input
          type="date"
          value={newShift.date}
          onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
        />
      </label>
      <label>
        Start Time:
        <input
          type="time"
          value={newShift.start}
          onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
        />
      </label>
      <label>
        End Time:
        <input
          type="time"
          value={newShift.end}
          onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
        />
      </label>
      <button onClick={handleAddShift}>Add Shift</button>
    </div>
  </div>
);

export default AllocateShift;
