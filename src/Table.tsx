import React from "react";
import cloneDeep from "lodash/cloneDeep";
import throttle from "lodash/throttle";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

const tableHeader = {
  nameWithOwner: "Name",
  stargazerCount: "🌟 Stars",
  forkCount: "🍴 Forks",
};

export default function Table (props: any){
  const countPerPage = 10;
  const [value, setValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dataPerPage, setDataPerpage] = React.useState(
    cloneDeep(props.tableData.slice(0, countPerPage))
  );

  /**
   * Item to be serched by name in table and return
   * Reset the pagination.
   */
  const searchData = React.useRef(
    throttle(val => {
      const query = val.toLowerCase();
      setCurrentPage(1);
      const data = cloneDeep(
        props.tableData
          .filter((item: { nameWithOwner: string; }) => item.nameWithOwner.toLowerCase().indexOf(query) > -1)
          .slice(0, countPerPage)
      );
      setDataPerpage(data);
    }, 400)
  );
 /*
   initialize component with pagination 1 when serchfield is empty.
   rerender when serch is performed.
  */
  React.useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      searchData.current(value);
    }
  }, [value]);

  /*
    updated page data when pagination changes.
   */
  const updatePage = (p:any) => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setDataPerpage(cloneDeep(props.tableData.slice(from, to)));
  };
 /*
   create table row.
  */
  const tableRows = (rowData: { key: any; index: any; }) => {
    const { key, index } = rowData;
    const tableCell = Object.keys(tableHeader);
    const columnData = tableCell.map((keyD, i) => {
      return <td key={i}>{key[keyD]}</td>;
    });

    return <tr key={index}>{columnData}</tr>;
  };

  const tableData = () => {
    return dataPerPage.map((key: any, index: any) => tableRows({ key, index }));
  };

  const headRow = () => {
    return Object.values(tableHeader).map((title, index) => (
      <td key={index}>{title}</td>
    ));
  };

  return (
    <>
      <div className="search">
        <input
          placeholder="Search owner by name"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>{headRow()}</tr>
        </thead>
        <tbody className="trhover">{tableData()}</tbody>
      </table>
      <Pagination
        pageSize={countPerPage}
        onChange={updatePage}
        current={currentPage}
        total={props.tableData.length}
      />
    </>
  );
};
