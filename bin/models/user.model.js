const dbPool = require('../config/database');

/**
 * User model
 */
class User {

    static async findById(id) {
        try {
            const connection = await dbPool.getConnection();
            const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
            connection.release();
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async findAll(includeGuides = false) {
        try {
            const connection = await dbPool.getConnection();
            let rows;
            let selectFields = ['users.id', 'users.uuid', 'users.name',
                'users.email', 'users.email_verified_at',
                'users.created_at', 'users.updated_at'];
            if (includeGuides) {
                selectFields = selectFields.concat(['user_guides.connect_portal', 'user_guides.create_page',
                    'user_guides.create_layout', 'user_guides.create_page_from_layout',
                    'user_guides.install_custom_global_module', 'user_guides.upgrade_custom_module',
                    'user_guides.generate_theme_preview', 'user_guides.generate_sr_badge',
                    'user_guides.is_complete', 'user_guides.created_at', 'user_guides.updated_at']);
                rows = [rows] = await connection.query(`SELECT ${selectFields}
                                                        FROM users
                                                                 LEFT JOIN user_guides ON users.id = user_guides.user_id`);
            } else {
                rows = [rows] = await connection.query(`SELECT ${selectFields}
                                                        FROM users`);
            }
            connection.release();
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


}

module.exports = User;
