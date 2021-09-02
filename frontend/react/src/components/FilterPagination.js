function FilterPagination(props) {
  const numPages = Math.ceil(props.total / props.permitsPerPage);

  const prevDisabled = props.page === 1;
  const nextDisabled = props.page === numPages;

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
        {[...Array(numPages)].map((x, i) => (
          <li
            className={"page-item " + (i + 1 === props.page ? "active" : "")}
            key={i}
          >
            <a
              className="page-link"
              href="#"
              onClick={() => {
                props.setPage(i + 1);
              }}
            >
              {i + 1}
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
