INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (Tony, Stark, tony @starkent.com, Iam1ronM @n);
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
DELETE FROM account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'a huge interior',
        'small interiors'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';
UPDATE inventory
SET inv_image = CONCAT(
        LEFT(inv_image, 7),
        '/vehicles',
        (SUBSTRING(inv_image, 8))
    ),
    inv_thumbnail = CONCAT(
        LEFT(inv_thumbnail, 7),
        '/vehicles',
        (SUBSTRING(inv_thumbnail, 8))
    );