function FilterPagination(props) {
  const numPages = Math.ceil(props.total / props.permitsPerPage);

  const prevDisabled = props.page === 1;
  const nextDisabled = props.page === numPages || props.total === 0;
  var pages = Array.from(Array(numPages + 1).keys()).slice(1);

  if (numPages > 11) {
    pages = [...Array(7).keys()].map((x) => x + (props.page - 3));
    const p = [...pages];
    for (var i = 0; i < 9; i++) {
      if (p[i] < 1) {
        pages.shift();
        pages.push(pages.slice(-1)[0] + 1);
      }
    }
    for (i = 0; i < 11; i++) {
      if (p[i] > numPages) {
        pages.pop();
        pages.unshift(pages[0] - 1);
      }
    }

    // add first and last page and elipses if there is a skip
    if (pages[0] !== 1) {
      if (pages[0] !== 2) {
        pages.unshift(-1);
      }
      pages.unshift(1);
    } else {
      //add more pages on right if fewer on left
      pages.push(pages.slice(-1)[0] + 1);
    }
    if (pages[pages.length - 1] !== numPages) {
      if (pages[pages.length - 1] !== numPages - 1) {
        pages.push(-2);
      }
      pages.push(numPages);
    } else {
      //add more pages on left if fewer on right
      pages.unshift(pages[0] - 1);
    }
  }
  return (
    <nav>
      <ul
        className={
          "pagination " + (props.center ? "justify-content-center" : "")
        }
      >
        <li className={"page-item " + (prevDisabled ? "disabled" : "")}>
          <a
            className="page-link"
            onClick={() => props.setPage((p) => p - 1)}
            href="#"
            tabIndex="-1"
          >
            Previous
          </a>
        </li>
        {pages.map((i) => (
          <li
            className={
              "page-item " +
              (i === props.page ? "active" : "") +
              (i < 0 ? "disabled" : "")
            }
            key={i}
          >
            {i > 0 && (
              <a
                className="page-link"
                href="#"
                onClick={() => {
                  props.setPage(i);
                }}
              >
                {i}
              </a>
            )}
            {i < 0 && (
              <a className="page-link" href="#">
                ...
              </a>
            )}
          </li>
        ))}
        <li className={"page-item " + (nextDisabled ? "disabled" : "")}>
          <a
            className="page-link"
            onClick={() => props.setPage((p) => p + 1)}
            href="#"
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default FilterPagination;
