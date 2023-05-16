import axios from 'axios';
import { IntlShape } from 'react-intl';
import Config from '../../../config';
import { store } from '../../../state/store';
import { toastSuccess } from '../../components/notifications';

class FBDownloadSheetTplState {

  public getBulkCreateTemplateId = (documentRevisionId: string, intl: IntlShape) => {
    axios({
      url: `${Config.ApiEndpoint}/mass_create/generate_template/${documentRevisionId}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    }).then(({ data }) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Form Template Spreadsheet.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toastSuccess(
        intl.formatMessage({ id: 'document.revision.bulkCreate.download.excelTemplate' })
      );
    });
  };
}

export default FBDownloadSheetTplState;
