import React, { useEffect } from "react";

type DateRangeProps = {
  setFrom: any;
  setTo: any;
  from_date: any;
  to_date: any;
};

const DateRange: React.FC<DateRangeProps> = ({
  setFrom,
  setTo,
  from_date,
  to_date,
}) => {
  useEffect(() => {
    return () => {
      setFrom({
        date: new Date(),
        time: "00:00",
      });

      setTo({
        date: new Date(),
        time: new Date().toLocaleTimeString().slice(0, 5),
      });
    };
  }, []);

  const handleFromDateChange = (e: any) => {
    const [date, time] = e.target.value.split("T");
    setFrom({
      date: new Date(date),
      time: time,
    });
  };

  const handleToDateChange = (e: any) => {
    const [date, time] = e.target.value.split("T");
    setTo({
      date: new Date(date),
      time: time,
    });
  };

  return (
    <div className="flex flex-row justify-between w-1/2 mx-auto bg-white p-4 rounded-lg shadow-lg">
      <label>From</label>
      <input
        type="datetime-local"
        max={new Date().toISOString().split(".")[0]}
        onChange={(e) => handleFromDateChange(e)}
        contentEditable={true}
        value={
          from_date?.date?.toISOString().split("T")[0] + "T" + from_date?.time
        }
      />
      <label>To</label>
      <input
        type="datetime-local"
        max={new Date().toISOString().split(".")[0]}
        onChange={(e) => handleToDateChange(e)}
        contentEditable={true}
        defaultValue={
          to_date.date.toISOString().split("T")[0] + "T" + to_date.time
        }
      />
    </div>
  );
};

export default DateRange;
