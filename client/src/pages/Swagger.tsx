import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

function Swagger() {
  return <SwaggerUI url="http://localhost:8080/swagger.json" />;
}

export default Swagger;
