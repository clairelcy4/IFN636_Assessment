// test/schedulingStrategies.test.js
const {
  StrictStrategy,
  BufferStrategy,
  RelaxedStrategy,
  PriorityStrategy,
  FlexibleStrategy,
} = require("../models/schedulingStrategies");


const testAppointments = [
  { vetName: "Dr. Smith", appointDate: "2025-10-02T10:00:00", duration: 30 },
  { vetName: "Dr. Smith", appointDate: "2025-10-02T11:00:00", duration: 30 },
];

(async () => {
  const strict = new StrictStrategy();
  const buffer = new BufferStrategy(15);
  const relaxed = new RelaxedStrategy();
  const priority = new PriorityStrategy();
  const flexible = new FlexibleStrategy(5);

  const newAppt = { vetName: "Dr. Smith", appointDate: "2025-10-02T10:15:00", duration: 30 };

  console.log("Strict:", await strict.validate(newAppt, testAppointments));
  console.log("Buffer:", await buffer.validate(newAppt, testAppointments));
  console.log("Relaxed:", await relaxed.validate(newAppt, testAppointments));
  console.log("Priority (normal):", await priority.validate(newAppt, testAppointments));
  console.log("Priority (emergency):", await priority.validate({ ...newAppt, reason: "Emergency" }, testAppointments));
  console.log("Flexible:", await flexible.validate(newAppt, testAppointments));
})();
/*Strict : false (overlaps not allowed).

Buffer :false if the new appointment is too close.

Relaxed : true (since it only blocks exact start time).

Priority (normal) : false (still strict).

Priority (emergency) : true (emergency overrides).

Flexible : true if overlap is within allowed minutes, otherwise false.*/