import React from 'react';
export class ApiResponseTemplate {

    createTemplate(rowId) {
        return (<div>
            <p>{`This Expand row is belong to rowKey ${rowId}`}</p>
        </div>)
    }

}
export default new ApiResponseTemplate;

