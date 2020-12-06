<?php
    class DB {

        public $mysqli;

        public function __construct($DB_SERVER, $DB_USERNAME, $DB_PASSWORD, $DB_NAME) {
            if(!$this->mysqli = $this->connect($DB_SERVER, $DB_USERNAME, $DB_PASSWORD, $DB_NAME)) {
                die();
            }
        }

        private function connect($DB_SERVER, $DB_USERNAME, $DB_PASSWORD, $DB_NAME) {

            $mysqli = new mysqli($DB_SERVER, $DB_USERNAME, $DB_PASSWORD, $DB_NAME);
            $mysqli->set_charset('utf8');

            if (!$mysqli->connect_errno) {
                return $mysqli;
            } else {
                return false;
            }
        }

        private function get_data_types($data = array()) {
            
            $types = "";
            foreach ($data as $value) {

                if (gettype($value) == "string") {
                    $types .= "s";
                } elseif(gettype($value) == "integer" || gettype($value) == "float" || gettype($value) == "double") {
                    $types .= "d";
                }

            }
            return $types;

        }

        private function ref_values($array) {
			foreach ($array as $key => $value) {
                $array[$key] = &$array[$key];
            }

			return $array;
        }

        private function resolve_sql_return($result) {
            $results = [];

            while ($row = $result->fetch_object()) {
                $results[] = $row;
            }
            return $results;
        }
        
        private function stmt_resolve(string $query, array $vals, bool $return_result = false) {
            if (gettype($vals) != 'array' || empty($vals)) {
                    return false;
                } else {
                    if(!$stmt = $this->mysqli->prepare($query)) {
                        return false;
                    }

                    $vals = $this->ref_values($vals);

                    array_unshift($vals, $this->get_data_types($vals));

                    call_user_func_array( array( $stmt, 'bind_param'), $vals);

                    if($stmt->execute()) {
                        if ($return_result) {
                            return $this->resolve_sql_return($stmt->get_result());
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
        }

        public function select(string $query, bool $stmt = false, array $vals = []) {
            if ($stmt === true) {
                return $this->stmt_resolve($query, $vals, true);
            } else {
                if($result = $this->mysqli->query($query)) {
                    return $this->resolve_sql_return($result);
                } else {
                    return false;
                }
            }
        }

        public function insert(string $query, bool $stmt = false, array $vals = []) {

            if ($stmt === true) {

                return $this->stmt_resolve($query, $vals);
                
            } else {
                if ($this->mysqli->query($query)) {
                    return true;
                } else {
                    return false;
                }
            }

        }

        public function update(string $query, bool $stmt = false, array $vals = []) {

            if ($stmt === true) {

                return $this->stmt_resolve($query, $vals);
                
            } else {
                if ($this->mysqli->query($query)) {
                    return true;
                } else {
                    return false;
                }
            }

        }

        public function delete(string $query, bool $stmt = false, array $vals = []) {
            if ($stmt === true) {
                return $this->stmt_resolve($query, $vals);
            } else {
                if($this->mysqli->query($query)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }


    /*//Insert without stmt
        $query = "INSERT INTO `try` (text_field, date_field, int_field) VALUES ('asd', NOW(), 55)";

        if($db->insert($query)) {
            echo "<br>Data without stmt were successfuly inserted.";
        } else {
            echo "<br><b>Insert without stmt error: </b>" . $db->mysqli->error;
        }

    //Insert with stmt
        $query = "INSERT INTO `try` (text_field, date_field, int_field) VALUES (?, NOW(), ?)";

        $values = array('Nějak txt', -5.40);

        if($db->insert($query, true, $values)) {
            echo "<br>Data with stmt were successfuly inserted.";
        } else {
            echo "<br><b>Insert with stmt error: </b>" . $db->mysqli->error;
        }
    //Update
    */
?>