function next_page() {
  page++;
  document.getElementById("pagecount").innerHTML = page + 1;
  clear_permits();
  get_list();
}
function prev_page() {
  if (page <= 0) {
    return;
  }
  page--;
  document.getElementById("pagecount").innerHTML = page + 1;
  clear_permits();
  get_list();
}
var page = 0;
var permits_per_page = 10;

function clear_permits() {
  let div = document.getElementById("permits");
  div.innerHTML = "";
}

async function classify(id) {
  let mutation = `
	mutation mark_${id}_as_construction {
		updatePermit(input: { patch: { classification: CONSTRUCTION }, id: ${id}}) {
			clientMutationId
			permit {
				id
				cost
				city
				sqft
				state
				street
				streetNumber
				source {
					name
				}
			}
		}
	}	
	`;
  var response = await fetch("/graphql", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: mutation,
      operationName: `mark_${id}_as_construction`,
    }),
  });
  if (!response.ok) {
    console.log(response.status);
    console.log(response.statusText);
    var data = await response.json();
    console.log(data);
  }
  var elements = document.getElementById(id).children;
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].tagName == "BUTTON") {
      elements[i].remove();
    }
  }
}

async function get_list() {
	let isConstruction = classified
    ? "{equalTo: CONSTRUCTION}"
    : "{equalTo: UNCLASSIFIED}";
  let query = `
query MyQuery {
  permits(
    first: ${permits_per_page}
	offset: ${page * permits_per_page}
    orderBy: COST_DESC
    filter: {classification: ${isConstruction}}
  ) {
    edges {
      node {
        id
        cost
        city
        sqft
        state
        street
        streetNumber
        source{
          name
        }
      }
    }
  }
}
`;
  var response = await fetch("/graphql", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query, operationName: "MyQuery" }),
  });
  var data = await response.json();
  data.data.permits.edges.forEach((permit) => {
    let div = document.getElementById("permits");
    let container = document.createElement("div");
    container.id = permit.node.id;
    let button = document.createElement("button");
    let code = document.createElement("code");
    button.innerText = `classify ${permit.node.id}`;
    button.onclick = () => {
      classify(permit.node.id);
    };
    code.innerText = JSON.stringify(permit.node);
    div.appendChild(container);
    if (!classified) {
      container.appendChild(button);
    }
    container.appendChild(code);
  });
}

get_list();
