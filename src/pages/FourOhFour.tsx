import React from "react";
import { Link } from "react-router-dom";

function FourOhFour() {
  return (
    <div className="flex flex-col gap-3 items-center mt-12">
      <h2 className="text-2xl">404</h2>
      <h2 className="text-lg text-center">
        Den här sidan finns tyvärr inte,<br />
        eller så har du inte tillgång till den.
      </h2>
      <Link to="/" className="p-3 bg-green-600 text-white">Tillbaka till startsidan</Link>
    </div>
  );
}

export default FourOhFour;
