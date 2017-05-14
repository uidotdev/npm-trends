import request from 'axios';
import ReactOnRails from 'react-on-rails';

export default {

  /**
   * Retrieve list of entities from server using AJAX call.
   *
   * @returns {Promise} - Result of ajax call.
   */
  fetchEntities(url, params) {
    return request({
      method: 'GET',
      url: url,
      responseType: 'json',
      params: params,
    });
  },

  /**
   * Submit new entity to server using AJAX call.
   *
   * @param {Object} entity - Request body to post.
   * @returns {Promise} - Result of ajax call.
   */
  submitEntity(url, entity) {
    return request({
      method: 'POST',
      url: url,
      responseType: 'json',
      headers: ReactOnRails.authenticityHeaders(),
      data: entity,
    });
  },

  updateEntity(url, entity) {
    return request({
      method: 'PATCH',
      url: url,
      responseType: 'json',
      headers: ReactOnRails.authenticityHeaders(),
      data: entity,
    });
  },

  deleteEntity(url, entity) {
    return request({
      method: 'DELETE',
      url: url,
      responseType: 'json',
      headers: ReactOnRails.authenticityHeaders(),
      data: {'_method': 'delete'},
    });
  },

};