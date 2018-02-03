// ES 2015 Class to render a table given the JSON data and headers
// the table can be sorted by each column in ascending and descending order
class Table {
    // class constructor
    constructor(jsonData, columns) {
        this.currentColumn = "date";
        this.descendingOrder = true; 
        this.columns = columns;
        this.data = [];

        for (var key in jsonData) {
            this.data.push({
                date: key,
                channelBroadcasts: jsonData[key]
            });
        }

        this.renderTable();
    }

    // method that actually renders the table - called in the constructor
    // and when a column header is clicked so that the table can be re-rendered
    renderTable() {
        if (this.htmlTable != null) {
            this.htmlTable.empty();
        } else {
            this.htmlTable = $("#dataTable");
        }

        var tableHeader = $("<thead>").append(this.generateHeaders());
        this.htmlTable.append(tableHeader);

        var tableBody = $("<tbody>");
        for (var item of this.data) {
            tableBody.append(this.generateRow(item));
        }
        this.htmlTable.append(tableBody);
    }

    // contains the logic for setting the currently sorted column and the sorting
    // of the data 
    sortData(column) {
        if (column != this.currentColumn) {
            this.currentColumn = column;
            this.descendingOrder = true;
        } else {
            this.descendingOrder = !this.descendingOrder;
        }

        this.data.sort((a, b) => {
            var valueA, valueB;
            if (column === "date") {
                valueA = new Date(a.date);
                valueB = new Date(b.date);
            } else {
                valueA = a.channelBroadcasts[column];
                valueB = b.channelBroadcasts[column];
            }

            if (this.descendingOrder ? valueA > valueB : valueA < valueB) {
                return 1;
            } else if (this.descendingOrder ? valueA < valueB : valueA > valueB) {
                return -1;
            }
            
            return 0;
        });
    }

    // generates the headers of the table, with a clickable link to sort them and 
    // adds an up or down arrow to the currently sorted column to indicate the sort 
    // order
    generateHeaders() {
        var headerRow = $("<tr>");

        for (var key in this.columns) {
            var headerItem = $("<th>");

            var text = this.columns[key];

            if (key === this.currentColumn) {
                text += this.descendingOrder ? " ↓" : " ↑";
                headerItem.addClass("currentColumn");
            }

            var headerLink = $("<a>").text(text).attr('href', '#')
                                    .attr('id', key).on('click', (e) => this.headerClick(e));

            headerItem.append(headerLink);
            headerRow.append(headerItem);
        }

        return headerRow;
    }

    // renders a row of data in the table, including formatting the date
    generateRow(data) {
        var options = {
            month: 'long',
            year: 'numeric'
        };
        var dataRow = $("<tr>");

        var date = new Date(data.date).toLocaleDateString("en-GB", options);

        for (var dataKey in this.columns) {
            var cell;
            if (dataKey == "date") {
                cell = $("<td>").text(date);        
            } else {
                cell = $("<td>").text(data.channelBroadcasts[dataKey]);
            }

            if (dataKey === this.currentColumn) {
                cell.addClass("currentColumn");
            }

            dataRow.append(cell);
        }

        return dataRow;
    }

    // on click method for the headers
    headerClick(e) {
        this.sortData(e.target.id);
        this.renderTable();
    }

}