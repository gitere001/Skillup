import React from "react";
import CountUp from "react-countup";
import './NumberCounter.css'; // Import the CSS file

const NumberCounter = () => {
  return (
    <div className="number-counter">
      <div className="counter-container">
        <div className="counter-item">
          <p className="counter-value">
            <CountUp
              start={0}
              end={898}
              duration={3}
              enableScrollSpy={true}
              scrollSpyOnce={true}
            />
          </p>
          <p className="counter-label">Expert tutors</p>
        </div>
        <div className="counter-item">
          <p className="counter-value">
            <CountUp
              end={20000}
              separator=","
              suffix="+"
              duration={3}
              enableScrollSpy={true}
              scrollSpyOnce={true}
            />
          </p>
          <p className="counter-label">Hours content</p>
        </div>
        <div className="counter-item">
          <p className="counter-value">
            <CountUp
              end={298}
              duration={3}
              enableScrollSpy={true}
              scrollSpyOnce={true}
            />
          </p>
          <p className="counter-label">Subject and courses</p>
        </div>
        <div className="counter-item">
          <p className="counter-value">
            <CountUp
              end={72878}
              separator=","
              suffix="+"
              duration={3}
              enableScrollSpy={true}
              scrollSpyOnce={true}
            />
          </p>
          <p className="counter-label">Active students</p>
        </div>
      </div>
    </div>
  );
};

export default NumberCounter;
