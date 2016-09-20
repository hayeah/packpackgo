import * as test from "tape";
import * as React from "react";
import { shallow } from "enzyme";

import { HelloList } from "./HelloList";

test("<HelloList> should have 'length' number of li elements", t => {
	let view = shallow(<HelloList length={10}/>);
	t.equal(view.find("li").length, 10);
	t.end();
});


