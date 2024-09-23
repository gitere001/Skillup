import React from "react";
import { Container, Row, Col } from "reactstrap";

const Company = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col lg="2" md="3" sm="4" xs="6">
            <h3 className=" d-flex align-items-center gap-1">
            3,000
            </h3>
            <b>Success stories</b>
          </Col>

          <Col lg="2" md="3" sm="4" xs="6">
            <h3 className=" d-flex align-items-center gap-1">
              1,000+
            </h3>
            <b>Tutors</b>
          </Col>

          <Col lg="2" md="3" sm="4" xs="6">
            <h3 className=" d-flex align-items-center gap-1">
              500+
            </h3>
            <b>Courses</b>
          </Col>

          <Col lg="2" md="3" sm="4" xs="6">
            <h3 className=" d-flex align-items-center gap-1">
              {" "}
             24/7
             support
            </h3>
          </Col>

          <Col lg="2" md="3" sm="4" xs="6">
            <h3 className=" d-flex align-items-center gap-1">
              {" "}
             Accessible anywhere
            </h3>
          </Col>

          <Col lg="2" md="3" sm="4" xs="6">
            <h2 className=" d-flex align-items-center gap-1">
              {" "}
            Friendly rates
            </h2>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Company;