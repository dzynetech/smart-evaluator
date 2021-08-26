var current_site = 0;
var image_dir = "/data/";
var query;

colors = {
  UNCLASSIFIED: {
    border: "8px solid #EEE",
    backgroundColor: "#FFFFFF",
  },
  CONSTRUCTION: {
    border: "8px solid #00CC00",
    backgroundColor: "#CCFFCC",
  },
  NOT_CONSTRUCTION: {
    border: "8px solid #FF0000",
    backgroundColor: "#FFCCCC",
  },
  POSSIBLE_CONSTRUCTION: {
    border: "8px solid #DDDD00",
    backgroundColor: "#FFFF99",
  },
  DUPLICATE: {
    border: "8px solid #FF0000",
    backgroundColor: "#FFCCCC",
  },
  HIGHLIGHT: {
    border: "8px solid #999",
    backgroundColor: "#EEEEEE",
  },
};

querySites = "query ListSitesQuery { sources { nodes { name id } } }";

function buildQuery(
  site_number,
  classification_enum = "",
  street = "",
  city = "",
  state = "",
  zip = "",
  min_cost = 0,
  min_sqft = 0
) {
  min_cost = Number(min_cost);
  min_sqft = Number(min_sqft);
  var sourceId = "";
  var classification_filter = "";
  if (classification_enum != "") {
    var classification_filter = `classification: {equalTo: ${classification_enum}}`;
  }
  // add filter where image_url not null
  if (site_number > 0) sourceId = `sourceId: { equalTo: ${site_number} }`;
  var query = `query MyQuery {
      permits(
        orderBy: COST_DESC
        filter: {
          and: {
            imageUrl: { isNull: false }
            sqft: { greaterThanOrEqualTo: ${min_sqft} }
            cost: { greaterThanOrEqualTo: ${min_cost} }
            ${classification_filter}
            ${sourceId}
            city: {includesInsensitive: "${city}"}
            street: {includesInsensitive: "${street}"}
            state: {includesInsensitive: "${state}"}
            zip: {includesInsensitive: "${zip}"}
            hasLocation: { equalTo: true }
            and: {
              or: [
                { permitData: { includes: "COMOTH" } }
                { permitData: { includes: "COMRET" } }
                { permitData: { includes: "Commercial" } }
                { permitData: { includes: "New Construction" } }
                { permitData: { includes: "NEWCON" } }
                { permitData: { includes: "ERECT" } }
              ]
            }
          }
        }
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
            source {
              name
            }
            location {
              x
              y
            }
            zip
            permitData
            classification
            notes
          }
        }
        totalCount
      }
    }`;
  console.log(query);
  return query;
}

async function classify(id, classification) {
  let mutation = `
      mutation mark_${id}_as_construction {
        updatePermit(input: { patch: { classification: ${classification} }, id: ${id}}) {
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
}

function setHighlighted(id) {
  current_site = id;
  //document.getElementById(id).style.border = colors.HIGHLIGHT.border;
  //document.getElementById(id).style.backgroundColor = colors.HIGHLIGHT.backgroundColor;
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function setYes(id, image_id) {
  document.getElementById(id).style.border = colors.CONSTRUCTION.border;
  document.getElementById(id).style.backgroundColor =
    colors.CONSTRUCTION.backgroundColor;
  setHighlighted(id + 1);
  classify(image_id, "CONSTRUCTION");
}

function setNo(id, image_id) {
  document.getElementById(id).style.border = colors.NOT_CONSTRUCTION.border;
  document.getElementById(id).style.backgroundColor =
    colors.NOT_CONSTRUCTION.backgroundColor;
  setHighlighted(id + 1);
  classify(image_id, "NOT_CONSTRUCTION");
}

function setMaybe(id, image_id) {
  document.getElementById(id).style.border =
    colors.POSSIBLE_CONSTRUCTION.border;
  document.getElementById(id).style.backgroundColor =
    colors.POSSIBLE_CONSTRUCTION.backgroundColor;
  setHighlighted(id + 1);
  classify(image_id, "POSSIBLE_CONSTRUCTION");
}

function setDuplicate(id, image_id) {
  document.getElementById(id).style.border = colors.DUPLICATE.border;
  document.getElementById(id).style.backgroundColor =
    colors.DUPLICATE.backgroundColor;
  setHighlighted(id + 1);
  classify(image_id, "DUPLICATE");
}

function setUnclassified(id, image_id) {
  document.getElementById(id).style.border = colors.UNCLASSIFIED.border;
  document.getElementById(id).style.backgroundColor =
    colors.UNCLASSIFIED.backgroundColor;
  setHighlighted(id + 1);
  classify(image_id, "UNCLASSIFIED");
}

// window.onkeypress = function () {
//   var x;
//   x = event.which;
//   keychar = String.fromCharCode(x);
//   if (keychar == "y") {
//     setYes(current_site);
//   } else if (keychar == "n") {
//     setNo(current_site);
//   }
// };

// document.onkeydown = checkKey;

// function checkKey(e) {
//   e = e || window.event;
//   if (e.keyCode == "37") {
//     setNo(current_site);
//   } else if (e.keyCode == "39") {
//     setYes(current_site);
//   }
// }

function loadSites(images) {
  div = document.getElementById("home");
  let total_count = images.data.permits.totalCount;
  try {
    document.getElementById("filtercount").remove();
  } catch {}
  div.insertAdjacentHTML(
    "beforebegin",
    `<p id="filtercount">Filter returned ${total_count} results</p>`
  );
  for (var i = 0; i < images.data.permits.edges.length; i++) {
    var image = images.data.permits.edges[i].node;
    var image_id = image["id"];
    //var image_id = image["image_url"];
    var classification = image["classification"];
    var address =
      image["streetNumber"] +
      " " +
      image["street"] +
      ", " +
      image["city"] +
      ", " +
      image["state"] +
      " " +
      image["zip"];
    var cost = image["cost"].toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    //first_image_filename = image["screenshots"][0]["filename"];
    //gif_filename = first_image_filename.substring(0, first_image_filename.length-15) + ".gif";
    //mp4_filename = first_image_filename.substring(0, first_image_filename.length-15) + ".mp4";
    var mp4_filename = image_dir + image["id"] + ".mp4";
    var border = colors[classification].border;
    var backgroundColor = colors[classification].backgroundColor;
    var str = `<div class="container-fluid">
    <div class="row align-items-center">
    <table class="col-lg-8 col-md-auto" style="border: ${border}; background-color: ${backgroundColor};" id="${i}"><tr>
        <td>            
          <video autoplay loop muted controls>
          <source src="${mp4_filename}" type="video/mp4">
          Your browser does not support the video tag.
          </video>
        </td>
          <td style="width: 500px;"> 
          <b style="font-size: 23px">${address}</b>
          <br/>
          Cost: <b>${cost}</b> Sqft: <b>${image["sqft"]}</b>
          <br/>
          <font style="">
          ${image["location"]["x"]} ${image["location"]["y"]}
          </font>
          <br/>
          id: ${image["id"]}
          <p/>
          <p/>
          Construction?<p/> 
          <button type="button" class="btn btn-primary" onclick="setNo(${i},${image_id})"><u>N</u>o</button>  
          <button type="button" class="btn btn-primary" onclick="setYes(${i},${image_id})"><u>Y</u>es</button>   
          <button type="button" class="btn btn-primary" onclick="setMaybe(${i},${image_id})">Maybe</button>   
          <button type="button" class="btn btn-primary" onclick="setDuplicate(${i},${image_id})">Duplicate</button> 
          <button type="button" class="btn btn-primary" onclick="setUnclassified(${i},${image_id})">Reset</button> 
          <p/>
          <div class="form-group">
            <textarea class="form-control" style="width:100%" id="notes-${image_id}" rows=2 placeholder="Enter a note" onblur="onTextAreaBlur(${image_id})">${
      image["notes"] || ""
    }</textarea>
          </div>
        </td>
        <td>
          <a href="${image_dir}${image["id"]} 2016-07-01.kml">2016</a><br/>
          <a href="${image_dir}${image["id"]} 2017-07-01.kml">2017</a><br/>
          <a href="${image_dir}${image["id"]} 2018-07-01.kml">2018</a><br/>
          <a href="${image_dir}${image["id"]} 2019-07-01.kml">2019</a><br/>
          <a href="${image_dir}${image["id"]} 2020-07-01.kml">2020</a><br/>
          <a href="${image_dir}${image["id"]} 2021-07-01.kml">2021</a><br/>
        </td>
        </tr>
        <table class="col-lg-3 col-md-auto permitDataTable" style="border: ${border}; background-color: ${backgroundColor}; " id="${i}">
        <tr>
          <td>
            <h5>Permit Data</h5>
          </td>
        </tr>
        <tr>
          <td>
            ${CleanPermitData(image["permitData"])}
          </td>
        </tr>
        </table>
        </table>
        </div>
        </div>
        `;
    //console.log(str);
    div.insertAdjacentHTML("beforeend", str);
  }
}

$.post(
  "/graphql",
  {
    query: querySites,
  },
  function (data, status) {
    console.log(JSON.stringify(data, null, "\t"));
  }
);
query = buildQuery(8);
$.post(
  "/graphql",
  {
    query: query,
  },
  function (data, status) {
    setJsonFile(data);
    //console.log(JSON.stringify(data,null,'\t'));
    loadSites(data);
    setCurlQuery(query);
  }
);
/*
$.get("images.json", 
  function(data, status) {
  loadSites(data);
});
*/
function onClassificationFilterChange() {
  var classification_type = document.getElementById(
    "classification_filter"
  ).value;
  var street = document.getElementById("streetFilter").value;
  var city = document.getElementById("cityFilter").value;
  var state = document.getElementById("stateFilter").value;
  var zip = document.getElementById("zipFilter").value;
  var minCost = document.getElementById("minCostFilter").value;
  var minSqft = document.getElementById("minSqftFilter").value;
  document.getElementById("home").innerHTML = "";
  query = buildQuery(
    8,
    classification_type,
    street,
    city,
    state,
    zip,
    minCost,
    minSqft
  );
  $.post(
    "/graphql",
    {
      query: query,
    },
    function (data, status) {
      setJsonFile(data);
      //console.log(JSON.stringify(data,null,'\t'));
      loadSites(data);
      setCurlQuery(query);
    }
  );
}
function setJsonFile(responseData) {
  var queryResponseJSON = JSON.stringify(responseData);
  var data = new Blob([queryResponseJSON], { type: "text/plain" });
  var url = window.URL.createObjectURL(data);
  document.getElementById("jsonDownload").href = url;
}

function onTextAreaBlur(id) {
  console.log(id);
  let text = document.getElementById(`notes-${id}`).value;
  console.log(text);
  let mutation = `
  mutation UpdateNotes{
    updatePermit(input: {patch: {notes: ${JSON.stringify(text)}}, id: ${id}}) {
      clientMutationId
    }
  }
  `;
  console.log(mutation);
  $.post("/graphql", {
    query: mutation,
  });
}

function CleanPermitData(json_data) {
  var data = JSON.parse(json_data);
  let unneeded = [
    "Accuracy Score",
    "Accuracy Type",
    "Bldg Sqft",
    "City",
    "County",
    "Country",
    "Estimated Construction Cost",
    "Latitude",
    "Longitude",
    "Number",
    "Site Location",
    "Source",
    "State",
    "Street",
    "Unit Type",
    "Unit Number",
    "Zip",
  ];
  unneeded.forEach((x) => {
    delete data[x];
  });
  var output = "";
  for (const [key, value] of Object.entries(data)) {
    output += `<b>${key}</b>: ${value}<br>`;
  }
  return output;
}

function toggleShowPermitData() {
  var displays = document.getElementsByClassName("permitDataTable");
  var button = document.getElementById("permitDataButton");
  for (var i = 0; i < displays.length; i++) {
    if (displays[i].style.display === "none") {
      displays[i].style.display = "block";
      button.innerText = "Hide Permit Data";
      document.getElementById(i).className = "col-lg-8 col-md-auto";
    } else {
      displays[i].style.display = "none";
      button.innerText = "Show Permit Data";
      document.getElementById(i).className = "";
    }
  }
}

function setCurlQuery(query) {
  document.getElementById("curlQuery").innerText = JSON.stringify(
    query
  ).replace(/\\n/g, " ");
}
