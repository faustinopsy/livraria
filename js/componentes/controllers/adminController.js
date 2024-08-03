import { isAdmin } from '../models/adminModel.js';
import { renderAdminView } from '../views/adminView.js';

export function initAdmin() {
    if (isAdmin()) {
        renderAdminView();
    } else {
        location.hash = '#login';
    }
}
