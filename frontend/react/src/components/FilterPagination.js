function FilterPagination(props) {
  const numPages = Math.ceil(props.total / props.permitsPerPage);

  const prevDisabled = props.page === 1;
  const nextDisabled = props.page === numPages || props.total === 0;
  var pages = Array.from(Array(numPages + 1).keys()).slice(1);

  if (numPages > 11) {
    pages = [];
    for (let i = 5; i > 0; i--) {
      if (props.page - i > 0) {
        pages.push(props.page - i);
      }
    }
    pages.push(props.page);
    for (let i = 1; i < 10; i++) {
      if (props.page + i > numPages || pages.length > 10) {
        break;
      }
      pages.push(props.page + i);
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
            className={"page-item " + (i === props.page ? "active" : "")}
            key={i}
          >
            <a
              className="page-link"
              href="#"
              onClick={() => {
                props.setPage(i);
              }}
            >
              {i}
            </a>
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
