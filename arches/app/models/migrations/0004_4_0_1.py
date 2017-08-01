# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2017-04-25 11:36
from __future__ import unicode_literals

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('models', '0003_40b4'),
    ]

    operations = [
        migrations.RunSQL("""
            INSERT INTO widgets(
                widgetid,
                name,
                component,
                datatype,
                defaultconfig
            ) VALUES (
                '31f3728c-7613-11e7-a139-784f435179ea',
                'resource-instance-select-widget',
                'views/components/widgets/resource-instance-select',
                'resource-instance',
                '{
                    "placeholder": ""
                }'
            );

            INSERT INTO widgets(
                widgetid,
                name,
                component,
                datatype,
                defaultconfig
            ) VALUES (
                'ff3c400a-76ec-11e7-a793-784f435179ea',
                'resource-instance-multiselect-widget',
                'views/components/widgets/resource-instance-multiselect',
                'resource-instance-list',
                '{
                    "placeholder": ""
                }'
            );

            INSERT INTO d_data_types
                VALUES (
                    'resource-instance',
                    'fa fa-external-link-o',
                    'datatypes.py',
                    'ResourceInstanceDataType',
                    '{
                        "graphid": null
                    }',
                    'views/components/datatypes/resource-instance',
                    'resource-instance-datatype-config',
                    FALSE,
                    '31f3728c-7613-11e7-a139-784f435179ea'
            );

            INSERT INTO d_data_types
                VALUES (
                    'resource-instance-list',
                    'fa fa-external-link-square',
                    'datatypes.py',
                    'ResourceInstanceListDataType',
                    '{
                        "graphid": null
                    }',
                    'views/components/datatypes/resource-instance',
                    'resource-instance-datatype-config',
                    FALSE,
                    'ff3c400a-76ec-11e7-a793-784f435179ea'
            );
            """,
            """
            DELETE FROM d_data_types
                WHERE datatype = 'resource-instance';

            DELETE from widgets
                WHERE widgetid = '31f3728c-7613-11e7-a139-784f435179ea';
        """),
    ]
