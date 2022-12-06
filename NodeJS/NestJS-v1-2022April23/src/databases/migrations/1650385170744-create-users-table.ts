import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUsersTable1650385170744 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            length: '100',
          },
          {
            name: 'fullname',
            type: 'varchar',
            length: '100',
          },
          {
            default: 'now()',
            name: 'createdAt',
            type: 'timestamp',
          },
          {
            default: 'now()',
            name: 'updatedAt',
            type: 'timestamp',
          },
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
