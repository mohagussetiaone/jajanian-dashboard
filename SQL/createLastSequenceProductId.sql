-- fungsi untuk get sequence
SELECT * FROM get_current_sequence_value('product.products_product_id_seq');
-- create fungsi untuk get id product terakhir
CREATE OR REPLACE FUNCTION public.get_last_product_id()
RETURNS integer AS
$BODY$
DECLARE
 last_value integer;
BEGIN
 SELECT pg_sequence_last_value('product.products_product_id_seq') INTO last_value;
 RETURN last_value;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

DROP FUNCTION IF EXISTS get_current_sequence_value(VARCHAR);



