class StrictStrategy {
  async validate(newAppt, existingAppointments) {
    const newStart = new Date(newAppt.appointDate).getTime();
    const newEnd = newStart + newAppt.duration * 60000;

    // Same vet, any overlap not allowed
    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const existingStart = new Date(a.appointDate).getTime();
      const existingEnd = existingStart + a.duration * 60000;

      return newStart < existingEnd && newEnd > existingStart;
    });
  }
}

class BufferStrategy {
  constructor(bufferMinutes = 15) {
    this.bufferMinutes = bufferMinutes;
  }

  async validate(newAppt, existingAppointments) {
    const newStart = new Date(newAppt.appointDate).getTime();
    const newEnd = newStart + newAppt.duration * 60000;

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const existingStart = new Date(a.appointDate).getTime();
      const existingEnd = existingStart + a.duration * 60000;

      return (
        newStart < existingEnd + this.bufferMinutes * 60000 &&
        newEnd > existingStart - this.bufferMinutes * 60000
      );
    });
  }
}

class RelaxedStrategy {
  async validate(newAppt, existingAppointments) {
    // Only block exact same start time for same vet
    return !existingAppointments.some(
      (a) =>
        a.vetName === newAppt.vetName &&
        new Date(a.appointDate).getTime() ===
          new Date(newAppt.appointDate).getTime()
    );
  }
}

//  Priority-based: emergencies always allowed
class PriorityStrategy {
  async validate(newAppt, existingAppointments) {
    if (
      newAppt.reason &&
      newAppt.reason.toLowerCase() === "emergency"
    ) {
      return true; // always allow emergency
    }

    // fallback to strict overlap check
    const newStart = new Date(newAppt.appointDate).getTime();
    const newEnd = newStart + newAppt.duration * 60000;

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const existingStart = new Date(a.appointDate).getTime();
      const existingEnd = existingStart + a.duration * 60000;

      return newStart < existingEnd && newEnd > existingStart;
    });
  }
}

// ⏱ Flexible: small overlap allowed (default 5 mins)
class FlexibleStrategy {
  constructor(overlapMinutes = 5) {
    this.overlapMinutes = overlapMinutes;
  }

  async validate(newAppt, existingAppointments) {
    const newStart = new Date(newAppt.appointDate).getTime();
    const newEnd = newStart + newAppt.duration * 60000;

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const existingStart = new Date(a.appointDate).getTime();
      const existingEnd = existingStart + a.duration * 60000;

      const allowedOverlap = this.overlapMinutes * 60000;

      return (
        newStart < existingEnd - allowedOverlap &&
        newEnd > existingStart + allowedOverlap
      );
    });
  }
}

module.exports = {
  StrictStrategy,
  BufferStrategy,
  RelaxedStrategy,
  PriorityStrategy,
  FlexibleStrategy,
};

